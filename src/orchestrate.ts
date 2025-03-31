import { execSync } from "child_process";
import * as fs from "fs";
import path from "path";
import { validateTestInputs } from "./validateSchema";
import { generateForgeScript } from "./generateForgeScript";
import { generateTests } from "./generateTests";
import type { OrchestrationConfig } from "./types";

export async function orchestrate(config: OrchestrationConfig) {
  const { calldataLibPath, outputDir } = config;

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  try {
    // 1. Generate TypeScript code
    console.log("Generating TypeScript code...");
    const tsOutputPath = path.join(outputDir, "tsCall.ts");
    execSync(`bun run src/conv.ts ${calldataLibPath} ${tsOutputPath}`);

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

    // 3. Run Forge script
    console.log("Running Forge script...");
    const forgeOutput = execSync(
      `forge script ${forgeScriptPath} --rpc-url http://localhost:8545`
    );
    const expectedOutputs = parseForgeOutput(forgeOutput.toString());

    // 4. Generate and run tests
    console.log("Generating and running tests...");
    const testPath = path.join(outputDir, "tsCall.test.ts");
    const tests = generateTests(calldataLibPath, expectedOutputs, inputs);
    fs.writeFileSync(testPath, tests);

    // Update the import path in the generated test file to use the correct path
    const tsCallPath = path.relative(path.dirname(testPath), tsOutputPath);
    const updatedTests = tests.replace(
      "import * as CalldataLib from './tsCall';",
      `import * as CalldataLib from '${tsCallPath}';`
    );
    fs.writeFileSync(testPath, updatedTests);

    // Run tests using Bun
    console.log("Running tests with Bun...");
    execSync(`bun test ${testPath}`, {
      stdio: "inherit",
      env: { ...process.env, NODE_ENV: "test" },
    });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

function parseForgeOutput(output: string): string[] {
  // Parse the Forge output to extract the bytes results
  const outputs: string[] = [];
  const lines = output.split("\n");
  for (const line of lines) {
    if (line.includes("bytes")) {
      outputs.push(line.split(":")[1].trim());
    }
  }
  return outputs;
}
