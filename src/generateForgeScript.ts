import * as fs from "fs";
import { parseFunctions } from "./parser";
import { generateTestInputs } from "./testInputGenerator";
import type {
  TestInputs,
  FunctionDef,
  SolidityEnum,
  MergedDefinitions,
} from "./types";
import { HARDCODED_FUNCTIONS, INPUT_DIR, OUTPUT_DIR } from "./consts";

/**
 * Generates a Forge script to test CalldataLib functions
 * @param calldataLibPath - Path to the CalldataLib.sol file
 * @returns Object containing the generated script and test inputs
 */
export function generateForgeScript(
  libPath: string,
  functions: FunctionDef[],
  enums: SolidityEnum[]
): {
  script: string;
  inputs: TestInputs[];
} {
  const allTestInputs: TestInputs[] = [];

  let forgeScript = `
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {CalldataLib} from "../input/CalldataLib.sol";

contract GenerateCalldata is Script {
    function setUp() public {}

    function run() public {
        // Test each function with generated inputs
`;

  functions.forEach((func, index) => {
    // Skip hardcoded functions
    if (isHardCodedFunction(func.name)) {
      return;
    }

    const testInputs = generateTestInputs(func, enums);
    allTestInputs.push(testInputs);

    // Handle special cases for enum parameters
    const modifiedSolidityValues = processEnumParameters(
      func,
      [...testInputs.solidityValues],
      enums
    );

    // Determine if this is a special function that returns non-bytes type
    const isSpecialReturnType = hasSpecialReturnType(func);

    if (isSpecialReturnType) {
      forgeScript += generateSpecialFunctionTest(
        func,
        modifiedSolidityValues,
        index
      );
    } else {
      forgeScript += generateStandardFunctionTest(
        func,
        modifiedSolidityValues,
        index
      );
    }
  });

  forgeScript += `
    }
}`;

  return { script: forgeScript, inputs: allTestInputs };
}

function isHardCodedFunction(functionName: string): boolean {
  return HARDCODED_FUNCTIONS.includes(functionName);
}

/**
 * Process enum parameters to replace numeric values with proper enum values
 */
function processEnumParameters(
  func: FunctionDef,
  values: string[],
  enums: SolidityEnum[]
): string[] {
  // Handle SweepType enum in the sweep and unwrap functions
  if (func.name === "sweep" || func.name === "unwrap") {
    // Find the index of the SweepType parameter
    const sweepTypeIndex = func.params.findIndex((param) =>
      param.type.includes("SweepType")
    );
    if (sweepTypeIndex >= 0) {
      values[sweepTypeIndex] = "CalldataLib.SweepType.VALIDATE";
    }
  }
  return values;
}

/**
 * Checks if a function returns a special non-bytes type
 */
function hasSpecialReturnType(func: FunctionDef): boolean {
  return ["generateAmountBitmap", "setOverrideAmount"].includes(func.name);
}

/**
 * Generates test code for functions with special return types (uint128, etc.)
 */
function generateSpecialFunctionTest(
  func: FunctionDef,
  modifiedSolidityValues: string[],
  index: number
): string {
  return `
        // Test ${func.name}
        uint128 ${func.name}Result = CalldataLib.${func.name}(
            ${modifiedSolidityValues.join(",\n            ")}
        );
        console.log(uint(${
          func.name
        }Result)); // ${index} // Add index for parsing
`;
}

/**
 * Generates test code for standard functions that return bytes
 */
function generateStandardFunctionTest(
  func: FunctionDef,
  modifiedSolidityValues: string[],
  index: number
): string {
  return `
        // Test ${func.name}
        bytes memory ${func.name}Result = CalldataLib.${func.name}(
            ${modifiedSolidityValues.join(",\n            ")}
        );
        console.logBytes(${
          func.name
        }Result); // ${index} // Add index for parsing
`;
}

/**
 * Determines the appropriate console log function for a return type
 */
function logFunctionForReturnType(returnType: string): string {
  if (returnType.includes("uint")) {
    return "console.log";
  } else if (returnType.includes("bytes")) {
    return "console.logBytes";
  } else {
    throw new Error("Unhandled return type: " + returnType);
  }
}

// function extractDefinitionsFromFile(filePath: string): MergedDefinitions {
//   const content = fs.readFileSync(filePath, "utf8");
//   const { libraries, enums, structs } = parseSolidity(content);

//   return {
//     libraries: libraries.map((lib) => lib.trim()),
//     enums: enums.map(
//       (e) => `enum ${e.name} {
//       ${e.values.map((v) => v.name).join(",\n      ")}
//     }`
//     ),
//     structs: structs.map(
//       (s) => `struct ${s.name} {
//       ${s.fields.map((f) => `${f.type} ${f.name};`).join("\n      ")}
//     }`
//     ),
//   };
// }
