import * as fs from "fs";
import { parseCalldataLib } from "./parser";
import { generateTestInputs } from "./testInputGenerator";
import { TestInputs } from "./types";

export function generateForgeScript(calldataLibPath: string): {
  script: string;
  inputs: TestInputs[];
} {
  const functions = parseCalldataLib(calldataLibPath);
  const allTestInputs: TestInputs[] = [];

  let forgeScript = `
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "${calldataLibPath}";  // Updated import path

contract GenerateCalldata is Script {
    function setUp() public {}

    function run() public {
        // Load test inputs from JSON
        string memory root = vm.projectRoot();
        string memory path = string.concat(root, "/test-inputs.json");
        string memory json = vm.readFile(path);
`;

  functions.forEach((func, index) => {
    const testInputs = generateTestInputs(func);
    allTestInputs.push(testInputs);

    forgeScript += `
        // Test ${func.name}
        bytes memory ${func.name}Result = CalldataLib.${func.name}(
            ${testInputs.solidityValues.join(",\n            ")}
        );
        console.logBytes(${
          func.name
        }Result); // ${index} // Add index for parsing
`;
  });

  forgeScript += `
    }
}`;

  return { script: forgeScript, inputs: allTestInputs };
}
