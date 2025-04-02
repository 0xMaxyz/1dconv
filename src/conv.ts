import { parseSolidity } from "./parser";
import type { SolidityStruct, FunctionDef } from "./types";
import * as fs from "fs";
import * as path from "path";

const TYPE_MAP: Record<string, string> = {
  uint8: "number",
  uint16: "number",
  uint32: "number",
  uint64: "bigint",
  uint128: "bigint",
  uint256: "bigint",
  int8: "number",
  int16: "number",
  int32: "number",
  int64: "bigint",
  int128: "bigint",
  int256: "bigint",
  bool: "boolean",
  string: "string",
  bytes: "Hex",
  address: "Address",
  bytes1: "Hex",
  bytes2: "Hex",
  bytes3: "Hex",
  bytes4: "Hex",
  bytes5: "Hex",
  bytes6: "Hex",
  bytes7: "Hex",
  bytes8: "Hex",
  bytes9: "Hex",
  bytes10: "Hex",
  bytes11: "Hex",
  bytes12: "Hex",
  bytes13: "Hex",
  bytes14: "Hex",
  bytes15: "Hex",
  bytes16: "Hex",
  bytes17: "Hex",
  bytes18: "Hex",
  bytes19: "Hex",
  bytes20: "Hex",
  bytes21: "Hex",
  bytes22: "Hex",
  bytes23: "Hex",
  bytes24: "Hex",
  bytes25: "Hex",
  bytes26: "Hex",
  bytes27: "Hex",
  bytes28: "Hex",
  bytes29: "Hex",
  bytes30: "Hex",
  bytes31: "Hex",
  bytes32: "Hex",
};

function convertType(
  solidityType: string,
  structs: SolidityStruct[] = []
): string {
  // Handle array types
  if (solidityType.endsWith("[]")) {
    const baseType = solidityType.slice(0, -2);
    return `${convertType(baseType, structs)}[]`;
  }

  // Handle fixed-size arrays
  const fixedArrayMatch = solidityType.match(/\[(\d+)\]$/);
  if (fixedArrayMatch) {
    const baseType = solidityType.slice(0, -fixedArrayMatch[0].length);
    return `${convertType(baseType, structs)}[]`;
  }

  // Handle mapping types
  if (solidityType.startsWith("mapping(")) {
    const [keyType, valueType] = solidityType
      .slice(8, -1)
      .split("=>")
      .map((t) => t.trim());
    if (!keyType || !valueType) {
      throw new Error(`Invalid mapping type: ${solidityType}`);
    }
    return `Record<${convertType(keyType, structs)}, ${convertType(
      valueType,
      structs
    )}>`;
  }

  // Handle struct types
  const struct = structs.find((s) => s.name === solidityType);
  if (struct) {
    return `{
      ${struct.fields
        .map((field) => `${field.name}: ${convertType(field.type, structs)}`)
        .join(";\n      ")}
    }`;
  }

  // Handle basic types
  return TYPE_MAP[solidityType] || "any";
}

function convertAbiEncodePacked(funcDef: FunctionDef): string {
  // Convert parameters with their types
  const tsParams = funcDef.params
    .map((param) => {
      const tsType = TYPE_MAP[param.type] || "any"; // Fallback to 'any' if type not found
      return `${param.name}: ${tsType}`;
    })
    .join(", ");

  // Convert return type
  const tsReturnType = TYPE_MAP[funcDef.returnType] || "any";

  // Process function body
  let tsBody = funcDef.body;

  // Process each abi.encodePacked call
  if (funcDef.body.includes("abi.encodePacked")) {
    // Look for all parameters inside abi.encodePacked
    const encodedParams = funcDef.body.match(/abi\.encodePacked\((.*)\)/)?.[1];
    if (encodedParams) {
      // Split by commas and handle nested function calls correctly ()
      const args = splitArgsRespectingParentheses(encodedParams);

      const types: string[] = [];
      const valueExpressions: string[] = [];

      args.forEach((arg) => {
        arg = arg.trim();

        // Skip comments
        if (arg.startsWith("//")) return;

        // Handle ternary operators (e.g., isBase ? uint8(1) : uint8(0))
        if (arg.includes("?")) {
          // Extract type from ternary expression (usually uint8)
          const castType = arg.match(/uint\d+/)?.[0] || "uint8";
          types.push(castType);
          valueExpressions.push(arg); // Keep the ternary as is
          return;
        }

        // hardcoded handler for functions that return uint128
        // TODO: remove this once we have a proper way to handle this
        const specialFunctionMatch = arg.match(
          /(generateAmountBitmap|setOverrideAmount)\((.*)\)/
        );
        if (specialFunctionMatch) {
          // These functions return uint128
          types.push("uint128");
          valueExpressions.push(arg);
          return;
        }

        // Handle enum types
        const enumMatch = arg.match(/(\w+)\.(\w+)\.(\w+)/); // Like CalldataLib.SweepType.VALIDATE
        if (enumMatch || arg.match(/sweepType/)) {
          types.push("uint8"); // Enums are uint8 in Solidity
          valueExpressions.push(arg);
          return;
        }

        // Handle regular type casting
        const castMatch = arg.match(/(\w+)\((.*)\)/);
        if (castMatch) {
          const castType = castMatch[1];
          const castValue = castMatch[2];
          types.push(castType);
          valueExpressions.push(`${castType}(${castValue})`);
        } else {
          // For regular variables
          const argName = arg.trim();
          // Find parameter type from function definition
          const param = funcDef.params.find((p) => p.name === argName);
          let paramType = param?.type || "bytes";

          // Clean up type by removing "memory" and other modifiers
          paramType = paramType
            .replace(" memory", "")
            .replace(" calldata", "")
            .trim();

          types.push(paramType);
          valueExpressions.push(argName);
        }
      });

      // Replace abi.encodePacked with our utility
      tsBody = tsBody.replace(
        /abi\.encodePacked\((.*)\)/,
        ` encodePacked(['${types.join("', '")}'], [${valueExpressions.join(
          ", "
        )}])`
      );
    }
  }

  // Reassemble the function
  return `${tsBody.replace(/;$/, ";")}`;
}

function splitArgsRespectingParentheses(argsStr: string): string[] {
  const result: string[] = [];
  let current = "";
  let depth = 0;

  for (let i = 0; i < argsStr.length; i++) {
    const char = argsStr[i];

    if (char === "(" || char === "{" || char === "[") {
      depth++;
      current += char;
    } else if (char === ")" || char === "}" || char === "]") {
      depth--;
      current += char;
    } else if (char === "," && depth === 0) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  if (current) {
    result.push(current);
  }

  return result;
}

function convertLib2Enum(libCode: string): string {
  // Regular expression to match library definitions
  const libraryRegex = /library\s+(\w+)\s*{([^}]*)}/g;
  // Regular expression to match constant declarations
  const constantRegex =
    /\w+\s+(?:internal\s+)?(?:constant\s+)?(\w+)\s*=\s*([^;]+);/g;

  let result = libCode;

  // Replace each library with enum
  result = result.replace(
    libraryRegex,
    (match, libraryName, libraryContent) => {
      // Extract all constants
      const constants: string[] = [];
      let constantMatch;

      while ((constantMatch = constantRegex.exec(libraryContent)) !== null) {
        const [_, name, value] = constantMatch;
        constants.push(`  ${name} = ${value}`);
      }

      // Create enum
      return `export enum ${libraryName} {\n${constants.join(",\n")}\n}\n\n`;
    }
  );

  return result;
}

/**
 * Converts Solidity code to TypeScript code
 * @param solidityCode - The Solidity code to convert
 * @returns The TypeScript code
 */
export function convertToTS(
  solidityCode: string,
  debug: boolean = false
): string {
  const { functions, enums, constants, structs, imports, libraries } =
    parseSolidity(solidityCode);

  let output = "";

  output += `
  import { type Hex, type Address, encodePacked } from "viem";
  import { uint128, uint8, uint112, uint16, _PRE_PARAM, _SHARES_MASK, _UNSAFE_AMOUNT, generateAmountBitmap, setOverrideAmount } from "../../src/utils.ts";
  `;

  // Add enum definitions
  enums.forEach((enumDef) => {
    output += `export enum ${enumDef.name} {\n`;
    enumDef.values.forEach((value) => {
      output += `  ${value.name} = "${value.name}",\n`;
    });
    output += "}\n\n";
  });

  // Add libraries as ts enums, remove the first one as it's the main library
  libraries.slice(1).forEach((lib) => {
    output += convertLib2Enum(lib);
  });

  // Add struct definitions
  structs.forEach((struct) => {
    output += `export interface ${struct.name} {\n`;
    struct.fields.forEach((field) => {
      output += `  ${field.name}: ${convertType(field.type, structs)};\n`;
    });
    output += "}\n\n";
  });

  // Add constant definitions
  // constants.forEach((constant) => {
  //   output += `export const ${constant.name} = ${constant.value};\n`;
  // });

  const hardcodedFunctions = ["generateAmountBitmap", "setOverrideAmount"];
  // Convert functions
  functions
    .filter((func) => !hardcodedFunctions.includes(func.name))
    .forEach((func) => {
      // Function signature
      output += `export function ${func.name}(`;
      output += func.params
        .map((param) => `${param.name}: ${convertType(param.type, structs)}`)
        .join(", ");
      output += `): ${convertType(func.returnType || "void", structs)} {\n`;

      let body = func.body;
      if (body.includes("abi.encodePacked")) {
        // then convert this
        body = convertAbiEncodePacked(func);
      }

      output += body;
      output += "}\n\n";
    });

  return output;
}
