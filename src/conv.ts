// solidity-to-ts-converter.ts
import * as fs from "fs";
import * as path from "path";
import { Parameter, FunctionDef, EnumDef, ConstantDef } from "./types";

function convertCalldataLibToTS(filePath: string): string {
  // Read the Solidity file
  const content = fs.readFileSync(filePath, "utf8");

  // Extract library name
  const libraryMatch = content.match(/library\s+(\w+)/);
  const libraryName = libraryMatch ? libraryMatch[1] : "CalldataLib";

  // Parse enums
  const enumMatches = [...content.matchAll(/enum\s+(\w+)\s*\{([^}]+)\}/g)];
  const enums = enumMatches.map((match) => {
    const enumName = match[1];
    const enumValues = match[2]
      .split(",")
      .map((val) => val.trim())
      .filter((val) => val)
      .map((val) => {
        const [name, value] = val.split("=").map((x) => x.trim());
        return { name, value };
      });

    return { name: enumName, values: enumValues };
  });

  // Parse constants
  const constantMatches = [
    ...content.matchAll(
      /(\w+)\s+(?:internal|private)\s+constant\s+(\w+)\s*=\s*([^;]+);/g
    ),
  ];
  const constants = constantMatches.map((match) => {
    return {
      type: match[1],
      name: match[2],
      value: match[3].trim(),
    };
  });

  // Parse functions
  const functionMatches = [
    ...content.matchAll(
      /function\s+(\w+)\s*\(([^)]*)\)\s*internal\s+pure\s+returns\s*\(([^)]*)\)\s*\{([^}]+)\}/g
    ),
  ];

  const functions = functionMatches.map((match) => {
    const functionName = match[1];
    const params: Parameter[] = match[2]
      .split(",")
      .map((param) => param.trim())
      .filter((param) => param)
      .map((param) => {
        const parts = param.split(" ").filter((p) => p);
        const type = parts.slice(0, -1).join(" ");
        const name = parts[parts.length - 1];
        return { type, name };
      });

    const returnType = match[3].trim();
    const body = match[4];

    return {
      name: functionName,
      params,
      returnType,
      body,
    };
  });

  // Generate TypeScript code
  let tsCode = `// Generated from ${path.basename(filePath)}\n`;
  tsCode += `import { encodePacked, Hex, Address } from 'viem';\n\n`;

  // Add enums
  for (const enumDef of enums) {
    tsCode += `export enum ${enumDef.name} {\n`;
    enumDef.values.forEach((val, index) => {
      if (val.value) {
        tsCode += `  ${val.name} = ${val.value}${
          index < enumDef.values.length - 1 ? "," : ""
        }\n`;
      } else {
        tsCode += `  ${val.name} = ${index}${
          index < enumDef.values.length - 1 ? "," : ""
        }\n`;
      }
    });
    tsCode += `}\n\n`;
  }

  // Add constants
  for (const constant of constants) {
    // Convert Solidity types to TypeScript types
    let tsType = "number";
    let value = constant.value;

    if (constant.type.includes("uint")) {
      tsType = "bigint";
      // Check if it's a bit shift operation
      if (value.includes("<<")) {
        const [base, shift] = value.split("<<").map((v) => v.trim());
        value = `${base}n << ${shift}n`;
      } else if (!value.includes("n")) {
        value = `${value}n`;
      }
    }

    tsCode += `export const ${constant.name}: ${tsType} = ${value};\n`;
  }
  tsCode += "\n";

  // Helper functions for encoding
  tsCode += `// Helper functions for bit manipulation\n`;
  tsCode += `function generateAmountBitmap(amount: bigint, preParam: boolean, useShares: boolean, unsafe: boolean = false): bigint {\n`;
  tsCode += `  let am = amount;\n`;
  tsCode += `  if (preParam) am = (am & ~_PRE_PARAM) | _PRE_PARAM;\n`;
  tsCode += `  if (useShares) am = (am & ~_SHARES_MASK) | _SHARES_MASK;\n`;
  tsCode += `  if (unsafe) am = (am & ~_UNSAFE_AMOUNT) | _UNSAFE_AMOUNT;\n`;
  tsCode += `  return am;\n`;
  tsCode += `}\n\n`;

  tsCode += `function setOverrideAmount(amount: bigint, preParam: boolean): bigint {\n`;
  tsCode += `  let am = amount;\n`;
  tsCode += `  if (preParam) am = (am & ~_PRE_PARAM) | _PRE_PARAM;\n`;
  tsCode += `  return am;\n`;
  tsCode += `}\n\n`;

  // Add function implementations
  for (const func of functions) {
    // Convert parameter types from Solidity to TypeScript
    const tsParams = func.params
      .map((param) => {
        let tsType = "unknown";

        if (param.type === "address") tsType = "Address";
        else if (param.type === "uint256" || param.type.includes("uint"))
          tsType = "bigint";
        else if (param.type === "bool") tsType = "boolean";
        else if (param.type === "bytes" || param.type === "bytes memory")
          tsType = "Hex";
        else if (param.type === "string" || param.type === "string memory")
          tsType = "string";

        return `${param.name}: ${tsType}`;
      })
      .join(", ");

    // Convert return type
    let tsReturnType = "any";
    if (func.returnType === "bytes memory") tsReturnType = "Hex";

    // Generate function header
    tsCode += `export function ${func.name}(${tsParams}): ${tsReturnType} {\n`;

    // Analyze function body to determine if it uses abi.encodePacked
    if (func.body.includes("abi.encodePacked")) {
      // Extract the parameters from abi.encodePacked
      const encodeMatch = func.body.match(/abi\.encodePacked\s*\(([^)]+)\)/);

      if (encodeMatch) {
        const encodeParams = encodeMatch[1]
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p);

        // Convert parameter types to viem-compatible format
        const viemTypes = func.params.map((param) => {
          // Clean the type by removing memory keyword and any comments or newlines
          const type = param.type
            .replace(" memory", "")
            .replace(/\/\/.*$/gm, "") // Remove comments
            .replace(/\n/g, "") // Remove newlines
            .trim(); // Remove extra whitespace

          if (type.includes("uint")) return `'${type}'`;
          if (type === "address") return "'address'";
          if (type.includes("bytes")) return `'${type}'`;
          if (type === "bool") return "'bool'";
          return `'${type}'`; // fallback
        });

        const paramNames = func.params.map((p) => p.name);

        tsCode += `  return encodePacked(\n`;
        tsCode += `    [${viemTypes.join(", ")}],\n`;
        tsCode += `    [${paramNames.join(", ")}]\n`;
        tsCode += `  );\n`;
      } else {
        // If we couldn't properly parse, use a simplified approach
        // Convert parameter types to viem-compatible format
        const viemTypes = func.params.map((param) => {
          // Clean the type by removing memory keyword and any comments or newlines
          const type = param.type
            .replace(" memory", "")
            .replace(/\/\/.*$/gm, "") // Remove comments
            .replace(/\n/g, "") // Remove newlines
            .trim(); // Remove extra whitespace

          if (type.includes("uint")) return `'${type}'`;
          if (type === "address") return "'address'";
          if (type.includes("bytes")) return `'${type}'`;
          if (type === "bool") return "'bool'";
          return `'${type}'`; // fallback
        });

        const paramNames = func.params.map((p) => p.name);

        tsCode += `  return encodePacked(\n`;
        tsCode += `    [${viemTypes.join(", ")}],\n`;
        tsCode += `    [${paramNames.join(", ")}]\n`;
        tsCode += `  );\n`;
      }
    } else {
      // If the function body doesn't use abi.encodePacked, use a simplified approach
      // Convert parameter types to viem-compatible format
      const viemTypes = func.params.map((param) => {
        // Clean the type by removing memory keyword and any comments or newlines
        const type = param.type
          .replace(" memory", "")
          .replace(/\/\/.*$/gm, "") // Remove comments
          .replace(/\n/g, "") // Remove newlines
          .trim(); // Remove extra whitespace

        if (type.includes("uint")) return `'${type}'`;
        if (type === "address") return "'address'";
        if (type.includes("bytes")) return `'${type}'`;
        if (type === "bool") return "'bool'";
        return `'${type}'`; // fallback
      });

      const paramNames = func.params.map((p) => p.name);

      tsCode += `  return encodePacked(\n`;
      tsCode += `    [${viemTypes.join(", ")}],\n`;
      tsCode += `    [${paramNames.join(", ")}]\n`;
      tsCode += `  );\n`;
    }

    tsCode += `}\n\n`;
  }

  return tsCode;
}

// Add at the end of the file:
// Usage
const inputFile = process.argv[2] || "./CalldataLib.sol";
const outputFile = process.argv[3] || "./ts-calldata-lib.ts";

try {
  const tsCode = convertCalldataLibToTS(inputFile);
  fs.writeFileSync(outputFile, tsCode);
  console.log(`Generated TypeScript code saved to ${outputFile}`);
} catch (error) {
  console.error("Error:", error);
}
