import { generateTestInputs } from "./testInputGenerator";
import type { TestInputs, FunctionDef, SolidityEnum } from "./types";
import { CALLDATA_LIB_PATH, HARDCODED_FUNCTIONS, INPUT_DIR } from "./consts";
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

  // import pre version
  const libName = path.basename(CALLDATA_LIB_PATH);
  imports = imports.replace(libName, libName.replace(".sol", "_pure.sol"));

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
`;

  functions.forEach((func, index) => {
    // Skip hardcoded functions
    if (isHardCodedFunction(func.name)) {
      return;
    }

    const testInputs = generateTestInputs(func, enums);
    allTestInputs.push(testInputs);

    forgeScript += generateTestFunc(
      func,
      [...testInputs.solidityValues],
      index
    );
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
        console.log("${func.name},");
        console.logBytes(${func.name}Result);
`;
}

function toRelativePath(absolutePath: string): string {
  return path.relative("./", absolutePath).replace(/\\/g, "/");
}
