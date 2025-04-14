import { getAddress } from "viem";
import type { FunctionDef, SolidityEnum, TestInputs } from "./types";
import { getRandomValues } from "crypto";

/**
 * Generates test inputs for a given function definition.
 * @param func - The function definition to generate test inputs for.
 * @returns The generated test inputs.
 */
export function generateTestInputs(
  func: FunctionDef,
  enums: SolidityEnum[]
): TestInputs {
  const solidity: string[] = [];
  const typescript: string[] = [];

  func.params.forEach((param) => {
    // First normalize the type by removing comments
    const normalizedType = param.type.replace(/\/\/\s*/, "").trim();
    const { solValue, tsValue } = generateValuePair(
      normalizedType,
      param.name,
      enums
    );
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
  paramName: string = "",
  enums: SolidityEnum[]
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
  if (enums) {
    const isEnum = enums.find((e) => e.name === cleanType);
    if (isEnum) {
      const enumValue = isEnum.values[0]!;
      return {
        solValue: `${isEnum.name}.${enumValue.name}`,
        tsValue: "0",
      };
    }
  }

  if (cleanType.startsWith("bytes")) {
    // handle bytes
    if (cleanType === "bytes") {
      const length = Math.floor(Math.random() * 50) + 1;
      const randomVal = generateRandomBytes(length);
      return {
        solValue: `"${randomVal}"`,
        tsValue: `"${randomVal}" as Hex`,
      };
    } else {
      const byteLength = parseInt(cleanType.replace("bytes", ""));
      if (byteLength >= 1 && byteLength <= 32) {
        const randomVal = generateRandomBytes(byteLength);
        return {
          solValue: `${randomVal}`,
          tsValue: `"${randomVal}" as Hex`,
        };
      }
    }
  }

  // Handle boolean parameters
  if (cleanType === "bool") {
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

  if (cleanType === "address") {
    const address = getAddress(generateRandomBytes(20));
    return {
      solValue: `${address}`,
      tsValue: `"${address}" as Address`,
    };
  }

  // // Handle specific parameters based on name
  // if (paramName === "assets" || paramName === "amount") {
  //   return {
  //     solValue: "1000000000000000000", // 1 ETH in wei
  //     tsValue: "1000000000000000000n",
  //   };
  // }

  // if (paramName === "market" || paramName === "data") {
  //   return {
  //     solValue: '"0x1de17a"',
  //     tsValue: '"0x1de17a" as Hex',
  //   };
  // }
  throw new Error(`Unsupported type: ${type}`);
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
function generateTest(
  func: FunctionInfo,
  expectedOutput: string,
  enums: SolidityEnum[]
): string {
  // Generate parameters based on their types
  const params = func.params.map((param) => {
    // Normalize the type by removing comments
    const normalizedType = param.type.replace(/\/\/\s*/, "").trim();
    const { tsValue } = generateValuePair(normalizedType, param.name, enums);
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
  functions: FunctionDef[],
  expectedOutputs: string[],
  enums: SolidityEnum[]
): string {
  const imports = `
import { describe, expect, test } from 'bun:test';
import * as CalldataLib from "./tsCall";
import { SweepType } from './tsCall';
import type { Address, Hex } from 'viem';
`;

  const tests = functions
    .map((func, index) => generateTest(func, expectedOutputs[index]!, enums))
    .join("\n");

  return `${imports}

describe('CalldataLib', () => {
${tests}
});
`;
}

function generateRandomBytes(length: number): string {
  const bytes = new Uint8Array(length);
  getRandomValues(bytes);

  return (
    "0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}
