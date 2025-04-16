import { parseSolidity } from "./parser";
import type {
  SolidityStruct,
  FunctionDef,
  ConverterOutput,
  Parameter,
} from "./types";
import { FUNCTION_REGEX, HARDCODED_FUNCTIONS } from "./consts";
// Uint8Array.fromHex
Uint8Array;
const TYPE_MAP: Record<string, string> = {
  uint8: "number",
  uint16: "number",
  uint24: "number",
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
  bytes: "Uint8Array",
  address: "Address",
  bytes1: "Uint8Array",
  bytes2: "Uint8Array",
  bytes3: "Uint8Array",
  bytes4: "Uint8Array",
  bytes5: "Uint8Array",
  bytes6: "Uint8Array",
  bytes7: "Uint8Array",
  bytes8: "Uint8Array",
  bytes9: "Uint8Array",
  bytes10: "Uint8Array",
  bytes11: "Uint8Array",
  bytes12: "Uint8Array",
  bytes13: "Uint8Array",
  bytes14: "Uint8Array",
  bytes15: "Uint8Array",
  bytes16: "Uint8Array",
  bytes17: "Uint8Array",
  bytes18: "Uint8Array",
  bytes19: "Uint8Array",
  bytes20: "Uint8Array",
  bytes21: "Uint8Array",
  bytes22: "Uint8Array",
  bytes23: "Uint8Array",
  bytes24: "Uint8Array",
  bytes25: "Uint8Array",
  bytes26: "Uint8Array",
  bytes27: "Uint8Array",
  bytes28: "Uint8Array",
  bytes29: "Uint8Array",
  bytes30: "Uint8Array",
  bytes31: "Uint8Array",
  bytes32: "Uint8Array",
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

function getFunctionReturnType(
  functionName: string,
  functions: FunctionDef[]
): string {
  const func = functions.find((f) => f.name === functionName);
  return func?.returnType || "bytes"; // Default to bytes if function not found
}

/**
 * Parses the type of a ternary expression
 * @param expression - The ternary expression to parse
 * @param functions - list of all functions
 * @param params - list of all params used for the function that is being parsed
 * @returns The type of the ternary expression
 */
function parseTernaryType(
  expression: string,
  functions: FunctionDef[],
  params: Parameter[]
): string {
  // split ternary into parts
  const [condition, truePart, falsePart] = expression
    .split(/\?|:/)
    .map((p) => p.trim());
  if (!truePart || !falsePart) throw new Error("Invalid ternary expression");
  // check one of the parts only to find the return type, the other part
  // should return the same type
  // first check if any of the parts returns a parameter
  let paramType = "";
  for (const p of params) {
    if (truePart === p.name) {
      paramType = p.type;
      break;
    }
    if (falsePart === p.name) {
      paramType = p.type;
      break;
    }
  }
  // return if found
  if (paramType) return paramType;

  // Helper to get type from expression
  const getExprType = (expr: string): string => {
    // Check for new bytes(0)
    if (expr.includes("bytes(0)")) {
      return "bytes";
    }

    // check for casts
    const castMatch = expr.match(FUNCTION_REGEX);
    if (
      castMatch &&
      (castMatch[0]?.startsWith("uint") || castMatch[0]?.startsWith("address"))
    ) {
      return castMatch[1]!;
    }

    // Check for function calls
    const funcMatch = expr.match(FUNCTION_REGEX);
    if (funcMatch) {
      if (funcMatch[1]?.startsWith("uint")) {
        // for casts
        return funcMatch[1];
      }
      return getFunctionReturnType(funcMatch[1]!, functions);
    }

    // Check for type casts
    const typeCastMatch = expr.match(FUNCTION_REGEX);
    if (typeCastMatch) {
      return typeCastMatch[1]!;
    }

    return "bytes"; // Default fallback
  };

  return getExprType(truePart);
}

function convertAbiEncodePacked(
  funcDef: FunctionDef,
  allFunctions: FunctionDef[]
): string {
  // Convert parameters with their types
  const tsParams = funcDef.params
    .map((param) => {
      const tsType = TYPE_MAP[param.type] || "any";
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

        // Skip comments (don't add them to types or values)
        if (arg.startsWith("//")) return;
        // Handle function calls
        const functionCallMatch = arg.match(FUNCTION_REGEX);
        if (
          functionCallMatch &&
          arg.indexOf(functionCallMatch?.[0] || "0") === 0 &&
          !arg.startsWith("uint") &&
          !arg.startsWith("bytes") &&
          !arg.startsWith("address")
        ) {
          const [_, funcName] = functionCallMatch;
          const returnType = getFunctionReturnType(funcName!, allFunctions);
          types.push(returnType);
          if (returnType === "bytes") {
            valueExpressions.push("`0x${" + arg + ".toHex()}`");
          } else {
            valueExpressions.push(arg);
          }
          return;
        }

        // Handle regular type casting
        if (
          functionCallMatch &&
          arg.indexOf(functionCallMatch?.[0] || "0") === 0
        ) {
          const castType = functionCallMatch[1] || "";
          const castValue = functionCallMatch[2] || "";
          types.push(castType);
          valueExpressions.push(`${castType}(${castValue})`);
          return;
        }

        // Handle ternary operators
        if (arg.includes("?")) {
          const inferredType = parseTernaryType(
            arg,
            allFunctions,
            funcDef.params
          );
          types.push(inferredType);
          // todo: if any side of the ternary is a function call, we need to wrap its return value correctly

          const [condition, truePart, falsePart] = arg
            .split(/\?|:/)
            .map((p) => p.trim());

          let modifiedTruePart = truePart;
          let modifiedFalsePart = falsePart;

          if (!truePart || !falsePart)
            throw new Error("Invalid ternary expression");
          // check true part
          const truePartMatch = truePart.match(FUNCTION_REGEX);
          if (
            truePartMatch &&
            truePartMatch[1] !== "newbytes" &&
            !truePartMatch[1]!.startsWith("uint") &&
            !truePartMatch[1]!.startsWith("bytes") &&
            !truePartMatch[1]!.startsWith("address")
          ) {
            const returnType = getFunctionReturnType(
              truePartMatch[1]!,
              allFunctions
            );
            if (returnType === "bytes") {
              modifiedTruePart = "`0x${" + truePartMatch[0] + ".toHex()}`";
            }
          }

          // check false part
          const falsePartMatch = falsePart.match(FUNCTION_REGEX);
          if (
            falsePartMatch &&
            falsePartMatch[1] !== "newbytes" &&
            !falsePartMatch[1]!.startsWith("uint") &&
            !falsePartMatch[1]!.startsWith("bytes") &&
            !falsePartMatch[1]!.startsWith("address")
          ) {
            const returnType = getFunctionReturnType(
              falsePartMatch[1]!,
              allFunctions
            );
            if (returnType === "bytes") {
              modifiedFalsePart = "`0x${" + falsePartMatch[0] + ".toHex()}`";
            }
          }
          //
          valueExpressions.push(
            `${condition} ? ${modifiedTruePart} : ${modifiedFalsePart}`
          );
          return;
        }

        // Handle enum types
        const enumMatch = arg.match(/(\w+)\.(\w+)\.(\w+)/); // Like CalldataLib.SweepType.VALIDATE
        if (enumMatch || arg.match(/sweepType/)) {
          types.push("uint8"); // Enums are uint8 in Solidity
          valueExpressions.push(arg);
          return;
        }

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
        if (!Object.keys(TYPE_MAP).includes(paramType)) {
          paramType = "bytes";
        }
        types.push(paramType);
        if (paramType.startsWith("bytes")) {
          valueExpressions.push("`0x${" + arg + ".toHex()}`");
        } else {
          valueExpressions.push(arg);
        }
      });

      // Replace abi.encodePacked with our utility
      // Clean up any comment-prefixed types like "// bytes" -> "bytes"
      const cleanedTypes = types.map((type) =>
        type.startsWith("//") ? type.replace("//", "").trim() : type
      );

      tsBody = tsBody.replace(
        /abi\.encodePacked\((.*)\)/,
        ` encodePacked(['${cleanedTypes.join(
          "', '"
        )}'], [${valueExpressions.join(", ")}])`
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
  result = result.replace(libraryRegex, (_, libraryName, libraryContent) => {
    // Extract all constants
    const constants: string[] = [];
    let constantMatch;

    while ((constantMatch = constantRegex.exec(libraryContent)) !== null) {
      const [_, name, value] = constantMatch;
      constants.push(`  ${name} = ${value}`);
    }

    // Create enum
    return `export enum ${libraryName} {\n${constants.join(",\n")}\n}\n\n`;
  });

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
): ConverterOutput {
  const { functions, enums, constants, structs, imports, libraries } =
    parseSolidity(solidityCode);

  let output = "";

  output += `
  import { type Hex, type Address, zeroAddress } from "viem";
  import { encodePacked, uint128, uint8, uint112, uint16, uint256, _PRE_PARAM, _SHARES_MASK, _UNSAFE_AMOUNT, generateAmountBitmap, setOverrideAmount, newbytes, bytes, getMorphoCollateral, getMorphoLoanAsset } from "../../src/utils.ts";
  `;

  // Add enum definitions
  enums.forEach((enumDef) => {
    output += `export enum ${enumDef.name} {\n`;
    enumDef.values.forEach((value, index) => {
      output += `  ${value.name} = ${index},\n`;
    });
    output += "}\n\n";
  });

  // Add libraries as ts enum
  libraries.forEach((lib) => {
    output += convertLib2Enum(lib.code);
  });

  // Add struct definitions
  structs.forEach((struct) => {
    output += `export interface ${struct.name} {\n`;
    struct.fields.forEach((field) => {
      output += `  ${field.name}: ${convertType(field.type, structs)};\n`;
    });
    output += "}\n\n";
  });

  // Convert functions
  functions
    .filter((func) => !HARDCODED_FUNCTIONS.includes(func.name))
    .forEach((func) => {
      const funcOutput = convertFunction(func, structs, functions);
      output += funcOutput;
    });

  return {
    output,
    functions,
    enums,
    constants,
    structs,
    imports,
    libraries,
  };
}

function convertFunction(
  func: FunctionDef,
  structs: SolidityStruct[],
  functions: FunctionDef[]
): string {
  let output: string = "";
  // Function signature
  output += `export function ${func.name}(`;
  output += func.params
    .map((param) => `${param.name}: ${convertType(param.type, structs)}`)
    .join(", ");
  output += `): ${convertType(func.returnType || "void", structs)} {\n`;

  let body = func.body;
  if (body.includes("abi.encodePacked")) {
    // then convert this
    body = convertAbiEncodePacked(func, functions);
  }
  body = body
    .replaceAll("revert", "throw new Error")
    .replaceAll("returnnewbytes(0)", "return `0x0` as Hex;\n")
    .replaceAll("==", "===")
    .replaceAll("!=", "!==")
    .replaceAll("bytesmemory", "const ")
    .replaceAll("return", "return ")
    .replaceAll(/=\s*(\d+)(?!n\b)/g, "= $1n")
    .replaceAll("type(uint120).max", "0xffffffffffffffffffffffffffffffn")
    .replaceAll("address(0)", "zeroAddress")
    .replaceAll(/\.length\s*===\s*0n/g, ".length === 0");

  output += body;
  output += "}\n\n";
  return output;
}
