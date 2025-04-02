import * as fs from "fs";
import path from "path";
import type { OrchestrationConfig } from "./types";
import { processImports, parseFunctions } from "./parser";
import { generateForgeScript } from "./generateForgeScript";
import { CLIENT_RENEG_LIMIT } from "tls";
import { validateTestInputs } from "./validateSchema";
import { generateTestSuite } from "./testInputGenerator";
import { execSync } from "child_process";

export async function converter(config: OrchestrationConfig) {
  const { calldataLibPath, outputDir, runTests, port, testCount, verbose } =
    config;
  let anvilProcess: any = null;
  let anvilPort = port || 43543;
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

    processImports(calldataLibPath, outputDir, verbose);

    // 2. Generate test inputs and Forge script
    console.log("Generating Forge script and test inputs...");
    const { script, inputs } = generateForgeScript(calldataLibPath);
    // Validate test inputs
    if (!validateTestInputs(inputs)) {
      throw new Error("Invalid test input format");
    }

    // Save test inputs and Forge script
    const testInputsPath = path.join(outputDir, "test-inputs.json");
    const forgeScriptPath = path.join(outputDir, "GenerateCalldata.s.sol");

    fs.writeFileSync(testInputsPath, JSON.stringify(inputs, null, 2));
    fs.writeFileSync(forgeScriptPath, script);

    // 3. Generate tests
    console.log("Generating tests...");
    const calldataLib = fs.readFileSync(calldataLibPath, "utf8");
    const functions = parseFunctions(calldataLib);

    const testFileName = baseFileName + ".test.ts";
    const testPath = path.join(outputDir, testFileName);

    // Generate the test file with proper imports
    let testContent = generateTestSuite(functions);
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

    // 4. Run tests if requested
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
  } finally {
    if (anvilProcess && !anvilProcess.killed) {
      try {
        process.kill(-anvilProcess.pid, "SIGTERM");
        console.log("Anvil process terminated");
      } catch (error) {
        console.log(
          "Note: Anvil process may still be running in the background"
        );
      }
    }
  }
}
