import * as fs from "fs";
import path from "path";
import type { ConverterConfig } from "./types";
import {
  processImports,
  parseFunctions,
  combineContent,
  cleanupPragmas,
  parseSolidity,
} from "./parser";
import { generateForgeScript } from "./generateForgeScript";
import { validateTestInputs } from "./validateSchema";
import { generateTestSuite } from "./testInputGenerator";
import { execSync } from "child_process";
import { LibCache } from "./libCache";
import { convertToTS } from "./conv";
import { removeIfConditions } from "./purifier";

function parseForgeOutput(output: string): string[] {
  const lines = output.split("\n");
  const hexOutputs: string[] = [];

  // Look for lines containing log outputs from the Forge script
  for (const line of lines) {
    // Check if the line starts with 0x
    const match = line.match(/0x[0-9a-f]+/i);
    if (match) {
      hexOutputs.push(match[0]);
    }
  }

  console.log(
    `Extracted ${hexOutputs.length} expected outputs from Forge script`
  );
  return hexOutputs;
}

export async function converter(config: ConverterConfig) {
  const { calldataLibPath, outputDir, runTests, testCount, verbose } = config;
  const cache = LibCache.getInstance();
  let numTestRuns = testCount || 1; // Todo: Implement testCount

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  try {
    // 1. Generate TypeScript library for calldataLib
    console.log("Generating TypeScript code...");
    // Get base file name without extension
    const baseFileName = path.basename(calldataLibPath, ".sol");
    const tsFileName = baseFileName + ".ts";
    const tsOutputPath = path.join(outputDir, tsFileName);

    // process imports and cache them
    await processImports(calldataLibPath, outputDir, verbose);

    // combine solidity files
    let combinedContent = combineContent(calldataLibPath, new Set(), verbose);
    combinedContent = cleanupPragmas(combinedContent);

    const { output, functions, enums, constants, structs, libraries } =
      convertToTS(combinedContent, verbose);

    // write output
    fs.writeFileSync(tsOutputPath, output);

    // create the no conditions versions of the calldatalib (both solidity and ts)
    await removeIfConditions([calldataLibPath, tsOutputPath]);

    // 2. Generate test inputs and Forge script
    console.log("Generating Forge script and test inputs...");
    const { script, inputs } = generateForgeScript(
      calldataLibPath,
      functions,
      enums
    );
    // Validate test inputs
    if (!validateTestInputs(inputs)) {
      throw new Error("Invalid test input format");
    }

    // Save test inputs and Forge script
    const testInputsPath = path.join(outputDir, "test-inputs.json");
    const forgeScriptPath = path.join(outputDir, "GenerateCalldata.s.sol");

    fs.writeFileSync(testInputsPath, JSON.stringify(inputs, null, 2));
    fs.writeFileSync(forgeScriptPath, script);

    // 3. Generate and run Forge script to get expected outputs
    console.log("Generating expected outputs...");
    let expectedOutputs: string[] = [];

    try {
      // Run the Forge script and capture its output
      const forgeOutput = execSync(`forge script ${forgeScriptPath}`, {
        encoding: "utf8",
      });

      // Parse the Forge output to extract expected hex outputs
      expectedOutputs = parseForgeOutput(forgeOutput);
      console.log(
        `Extracted ${expectedOutputs.length} expected outputs from Forge script`
      );

      // Save expected outputs to a file
      const expectedOutputsPath = path.join(outputDir, "expected-outputs.json");
      fs.writeFileSync(
        expectedOutputsPath,
        JSON.stringify(expectedOutputs, null, 2)
      );
    } catch (error) {
      console.error("Error running Forge script:", error);
      console.warn("Continuing without expected outputs");
    }

    // 4. Generate tests
    console.log("Generating tests...");

    const testFileName = baseFileName + ".test.ts";
    const testPath = path.join(outputDir, testFileName);

    // Generate the test file with proper imports and expected outputs
    const requiredFunctions = functions.filter((f) =>
      f.body.includes("abi.encodePacked")
    );
    let testContent = generateTestSuite(
      requiredFunctions,
      expectedOutputs,
      enums
    );
    testContent = testContent
      .replace(
        /import \* as CalldataLib from "\.\/tsCall";/,
        `import * as CalldataLib from "./${baseFileName}";`
      )
      .replace(
        /import \{ SweepType \} from '\.\/tsCall';/,
        `import { SweepType } from './${baseFileName}';`
      );

    fs.writeFileSync(testPath, testContent);

    // 5. Run tests if requested
    if (runTests) {
      console.log("Running tests...");
      try {
        execSync(`bun test ${testPath}`, { stdio: "inherit" });
        console.log("Tests completed successfully");
      } catch (error) {
        console.error("Tests failed:", error);
      }
    } else {
      console.log("Tests generated. To run them, use:");
      console.log(`bun test ${testPath}`);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
