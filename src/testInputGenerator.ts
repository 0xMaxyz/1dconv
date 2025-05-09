import { getAddress, isAddress, type Hex } from "viem";
import type { FunctionDef, SolidityEnum, TestInputs } from "./types";
import { getRandomValues } from "crypto";
import path from "path";
import { CALLDATA_LIB_PATH, OUTPUT_DIR, TEST_INPUTS_FILE } from "./consts";

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
    const { solValue, tsValue } = generateValuePair(normalizedType, enums);
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
 * @returns The generated values.
 */
function generateValuePair(
  type: string,
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

  // handle enums
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
      let length = Math.floor(Math.random() * 35) + 40; // min 40 bytes, required by morpho test
      if (length % 2 == 0) length++;
      const randomVal = generateRandomBytes(length);
      return {
        solValue: `hex"${randomVal.slice(2)}"`,
        tsValue: `"${randomVal}"`,
      };
    } else {
      const byteLength = parseInt(cleanType.replace("bytes", ""));
      if (byteLength >= 1 && byteLength <= 32) {
        const randomVal = generateRandomBytes(byteLength);
        return {
          solValue: `${randomVal}`,
          tsValue: `"${randomVal}"`,
        };
      }
    }
  }

  // Handle boolean parameters
  if (cleanType === "bool") {
    const randomBool = Math.random() < 0.5;
    return {
      solValue: randomBool ? "true" : "false",
      tsValue: randomBool ? "true" : "false",
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
    const address = generateRandomAddress();
    return {
      solValue: `${address}`,
      tsValue: `"${address}" as Address`,
    };
  }

  throw new Error(`Unsupported type: ${type}`);
}

function generateTest(
  func: FunctionDef,
  expectedOutputs: {
    name: string;
    hex: string;
  }[],
  enums: SolidityEnum[],
  params: string[]
): string {
  const eo = expectedOutputs.find((o) => o.name === func.name)?.hex;

  return `
  test('${func.name} should match Solidity output', () => {
    
      const result = CalldataLib.${func.name}(
        ${params.join(",\n        ")}
      );
      expect(result).toBe("${eo}");
  });`;
}

export async function generateTestSuite(
  functions: FunctionDef[],
  expectedOutputs: {
    name: string;
    hex: string;
  }[],
  enums: SolidityEnum[]
) {
  const imports = `
import { describe, expect, test } from 'bun:test';
import * as CalldataLib from "./${path
    .basename(CALLDATA_LIB_PATH)
    .replace(".sol", "_pure.ts")}";
import type { Address, Hex } from 'viem';
`;
  // read saved test inputs
  const testInputs = await Bun.file(
    path.join(OUTPUT_DIR, TEST_INPUTS_FILE)
  ).text();
  const testInputsJson: TestInputs[] = JSON.parse(testInputs);

  const tests = functions
    .map((func) =>
      generateTest(
        func,
        expectedOutputs,
        enums,
        testInputsJson.find((t) => t.functionName === func.name)!
          .typescriptValues
      )
    )
    .join("\n");

  return `${imports}

describe('CalldataLib', () => {
${tests}
});
`;
}

function generateRandomBytes(length: number): Hex {
  const bytes = new Uint8Array(length);
  getRandomValues(bytes);

  return ("0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")) as Hex;
}

function generateRandomAddress() {
  while (true) {
    const address = getAddress(generateRandomBytes(20));
    if (isAddress(address, { strict: false })) {
      return address;
    }
  }
}
