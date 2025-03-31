import { parseCalldataLib } from "./parser";
import type { TestInputs } from "./testInputGenerator";

/**
 * Generates test cases for the CalldataLib.sol file.
 * @param calldataLibPath - The path to the CalldataLib.sol file.
 * @param expectedOutputs - The expected outputs for the test cases.
 * @param testInputs - The test inputs for the test cases.
 * @returns A string containing the generated test cases.
 */
export function generateTests(
  calldataLibPath: string,
  expectedOutputs: string[],
  testInputs: TestInputs[]
): string {
  const functions = parseCalldataLib(calldataLibPath);

  let testFile = `
import { describe, expect, test } from 'bun:test';
import * as CalldataLib from './tsCall';
import { Address, Hex } from 'viem';

describe('CalldataLib', () => {
`;

  functions.forEach((func, index) => {
    const inputs = testInputs[index];
    if (!inputs) {
      throw new Error("No test inputs found for function: " + func.name);
    }
    const expectedOutput = expectedOutputs[index];

    testFile += `
  test('${func.name} should match Solidity output', () => {
    const result = CalldataLib.${func.name}(
      ${inputs.typescriptValues.join(",\n      ")}
    );
    expect(result).toBe("${expectedOutput}");
  });
`;
  });

  testFile += `
});
`;

  return testFile;
}
