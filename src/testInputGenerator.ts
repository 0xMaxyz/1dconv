import type { FunctionDef, TestInputs } from "./types";

/**
 * Generates test inputs for a given function definition.
 * @param func - The function definition to generate test inputs for.
 * @returns The generated test inputs.
 */
export function generateTestInputs(func: FunctionDef): TestInputs {
  const solidity: string[] = [];
  const typescript: string[] = [];

  func.params.forEach((param) => {
    // First normalize the type by removing comments
    const normalizedType = param.type.replace(/\/\/\s*/, "").trim();
    const { solValue, tsValue } = generateValuePair(normalizedType, param.name);
    solidity.push(solValue);
    typescript.push(tsValue);
  });

  return {
    functionName: func.name,
    solidityValues: solidity,
    typescriptValues: typescript,
  };
}

/**
 * Generates a pair of values for a given type.
 * @param type - The type to generate values for.
 * @param paramName - The parameter name (used for type inference)
 * @returns The generated values.
 */
function generateValuePair(
  type: string,
  paramName: string = ""
): {
  solValue: string;
  tsValue: string;
} {
  // Clean up type
  const cleanType = type
    .replace(" memory", "")
    .replace(" calldata", "")
    .replace(" storage", "")
    .trim();

  // Special handling for enum types
  if (cleanType === "SweepType" || paramName === "sweepType") {
    return {
      solValue: "0", // VALIDATE value (0)
      tsValue: "0", // Use a numeric value for compatibility with encodePacked
    };
  }

  // Handle 'bytes' or 'bytes memory' type
  if (cleanType === "bytes" || cleanType.startsWith("bytes")) {
    return {
      solValue:
        '"0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef"',
      tsValue:
        '"0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef" as Hex',
    };
  }

  // Handle boolean parameters
  if (
    cleanType === "bool" ||
    paramName.includes("unsafe") ||
    paramName.includes("isBase") ||
    paramName.includes("isShares") ||
    paramName === "overrideAmount"
  ) {
    return {
      solValue: "true",
      tsValue: "true",
    };
  }

  // Handle uint types
  if (cleanType.startsWith("uint")) {
    const bits = parseInt(cleanType.replace("uint", "")) || 256;
    // Use appropriate size based on bit width
    const num = Math.min(1e20, Math.pow(2, Math.min(bits, 53)) - 1);
    return {
      solValue: num.toString(),
      tsValue: `${num}n`,
    };
  }

  // Handle specific parameters based on name
  if (paramName === "assets" || paramName === "amount") {
    return {
      solValue: "1000000000000000000", // 1 ETH in wei
      tsValue: "1000000000000000000n",
    };
  }

  if (paramName === "market" || paramName === "data") {
    return {
      solValue: '"0x1de17a"',
      tsValue: '"0x1de17a" as Hex',
    };
  }

  // Handle other existing types
  switch (cleanType) {
    case "address":
      return {
        solValue: "0x1De17A0000000000000000000000000000000000",
        tsValue: `"0x1De17A0000000000000000000000000000000000" as Address`,
      };
    default:
      // For unknown types, make an educated guess based on parameter name
      if (
        paramName.includes("pool") ||
        paramName.includes("comet") ||
        paramName.includes("token") ||
        paramName.includes("receiver") ||
        paramName === "morphoB" ||
        paramName === "dToken" ||
        paramName === "aToken" ||
        paramName === "cToken"
      ) {
        return {
          solValue: "0x1De17A0000000000000000000000000000000000",
          tsValue: `"0x1De17A0000000000000000000000000000000000" as Address`,
        };
      }

      if (
        paramName.includes("Type") ||
        paramName.includes("Id") ||
        paramName === "mode" ||
        paramName === "poolType" ||
        paramName === "poolId"
      ) {
        return {
          solValue: "1", // A safe integer value
          tsValue: "1",
        };
      }

      console.warn(`Unsupported parameter type: ${type} for ${paramName}`);
      return {
        solValue: "0", // Default to 0 for unknown types
        tsValue: "0n",
      };
  }
}

interface FunctionInfo {
  name: string;
  params: Array<{
    name: string;
    type: string;
  }>;
  returnType: string;
}

// Generate test with appropriate expectations
function generateTest(func: FunctionInfo, expectedOutput: string): string {
  // Generate parameters based on their types
  const params = func.params.map((param) => {
    // Normalize the type by removing comments
    const normalizedType = param.type.replace(/\/\/\s*/, "").trim();
    const { tsValue } = generateValuePair(normalizedType, param.name);
    return tsValue;
  });

  return `
  test('${func.name} should match Solidity output', () => {
    
      const result = CalldataLib.${func.name}(
        ${params.join(",\n        ")}
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("${expectedOutput}");
  });`;
}

export function generateTestSuite(
  functions: FunctionInfo[],
  expectedOutputs: string[]
): string {
  const imports = `
import { describe, expect, test } from 'bun:test';
import * as CalldataLib from "./tsCall";
import { SweepType } from './tsCall';
import type { Address, Hex } from 'viem';
`;

  const tests = functions
    .map((func, index) => generateTest(func, expectedOutputs[index]!))
    .join("\n");

  return `${imports}

describe('CalldataLib', () => {
${tests}
});
`;
}
