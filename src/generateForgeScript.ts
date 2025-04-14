import { generateTestInputs } from "./testInputGenerator";
import type { TestInputs, FunctionDef, SolidityEnum } from "./types";
import { HARDCODED_FUNCTIONS, INPUT_DIR } from "./consts";
import { LibCache } from "./libCache";
import path from "path";

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
  const cache = LibCache.getInstance();
  const allLibraries = cache.getLibs();

  let imports: string = allLibraries
    .map((lib) => {
      let objs = "";
      // enums
      if (lib.enums.length > 0) {
        lib.enums.forEach((enumDef) => {
          objs += `${enumDef.name},`;
        });
      }
      // structs
      if (lib.structs.length > 0) {
        lib.structs.forEach((struct) => {
          objs += `${struct.name},`;
        });
      }
      // libraries
      if (lib.libraries.length > 0) {
        lib.libraries.forEach((libraryName) => {
          objs += `${libraryName.name},`;
        });
      }

      objs = objs.replace(/,$/, "");
      const ipath = toRelativePath(path.resolve(INPUT_DIR, lib.path));

      return objs.length > 0
        ? `import {${objs}} from "${ipath}";`
        : `import  "${ipath}";`;
    })
    .join("\n");

  const allTestInputs: TestInputs[] = [];

  let forgeScript = `
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "forge-std/console.sol";
${imports}

contract GenerateCalldata is Script {
    function setUp() public {}

    function run() public pure {
        // Test each function with generated inputs
`;

  functions.forEach((func, index) => {
    // Skip hardcoded functions
    if (isHardCodedFunction(func.name)) {
      return;
    }

    const testInputs = generateTestInputs(func, enums);
    allTestInputs.push(testInputs);

    if (!isHardcoded(func)) {
      forgeScript += generateTestFunc(
        func,
        [...testInputs.solidityValues],
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

function isHardcoded(func: FunctionDef): boolean {
  return HARDCODED_FUNCTIONS.includes(func.name);
}

function generateTestFunc(
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

function toRelativePath(absolutePath: string): string {
  return path.relative("./", absolutePath).replace(/\\/g, "/");
}
