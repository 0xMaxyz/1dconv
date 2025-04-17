import * as fs from "fs";
import path from "path";
import type { ConverterConfig } from "./types";
import { processImports, combineContent, cleanupPragmas } from "./parser";
import { generateForgeScript } from "./generateForgeScript";
import { validateTestInputs } from "./validateSchema";
import { generateTestSuite } from "./testInputGenerator";
import { execSync } from "child_process";
import { LibCache } from "./libCache";
import { convertToTS } from "./conv";
import { removeIfConditions } from "./purifier";
import { HARDCODED_FUNCTIONS, OUTPUT_DIR, TEST_INPUTS_FILE } from "./consts";
import { format } from "prettier";

function parseForgeOutput(output: string): { name: string; hex: string }[] {
  const lines = output.split("\n");
  const hexOutputs: { name: string; hex: string }[] = [];
  const indexOfLogs = lines.findIndex((line) => line === "== Logs ==");
  const linesAfterLogs = lines.slice(indexOfLogs + 1).filter((line) => line);

  linesAfterLogs.forEach((line, index) => {
    if (index % 2 === 0) {
      hexOutputs.push({
        name: line.trim().replace(",", ""),
        hex: linesAfterLogs[index + 1]!.trim(),
      });
    }
  });

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
    console.log("Generating TypeScript code...\n");
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
    console.log("Generating Forge script and test inputs...\n");
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
    const testInputsPath = path.join(outputDir, TEST_INPUTS_FILE);
    const forgeScriptPath = path.join(outputDir, "GenerateCalldata.s.sol");

    fs.writeFileSync(testInputsPath, JSON.stringify(inputs, null, 2));
    fs.writeFileSync(forgeScriptPath, script);

    // 3. Generate and run Forge script to get expected outputs
    console.log("Generating expected outputs...");
    let expectedOutputs: { name: string; hex: string }[] = [];
    try {
      // Run the Forge script and capture its output
      const forgeOutput = execSync(`forge script --via-ir ${forgeScriptPath}`, {
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
    console.log("Generating tests...\n");

    const testFileName = baseFileName + ".test.ts";
    const testPath = path.join(outputDir, testFileName);

    // Generate the test file with proper imports and expected outputs
    const requiredFunctions = functions.filter(
      (f) => !HARDCODED_FUNCTIONS.includes(f.name)
    );
    let testContent = await generateTestSuite(
      requiredFunctions,
      expectedOutputs,
      enums
    );

    fs.writeFileSync(testPath, testContent);

    // 5. Run tests if requested
    if (runTests) {
      console.log("Running tests...\n");
      try {
        const result = Bun.spawnSync(["bun", "test", testPath], {
          stdout: "inherit",
          stderr: "inherit",
        });
        if (result.exitCode === 0) {
          console.log("\n✅ Tests completed successfully\n");
          // format the test file
          console.log("Formatting all generated typescript files...\n");
          await formatAll();
        } else {
          console.error("\n❌ Tests failed:", result.stderr, "\n\n");
        }
      } catch (error) {
        console.error("\n❌ Tests failed:", error, "\n\n");
      }
    } else {
      console.log("Tests generated. To run them, use: \n");
      console.log(`bun test ${testPath}`);
      console.log("\n");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function tsFormatter(path_: string): Promise<void> {
  const content = await Bun.file(path_).text();
  const formatted = await format(content, {
    parser: "typescript",
    singleQuote: false,
    semi: true,
    printWidth: 120,
    tabWidth: 2,
    useTabs: true,
    trailingComma: "all",
    bracketSpacing: true,
  });
  await Bun.write(path_, formatted);
}

export async function formatAll(): Promise<void> {
  const glob = new Bun.Glob("**/*.ts");
  const tsFiles: string[] = [];
  for await (const file of glob.scan({ cwd: OUTPUT_DIR })) {
    tsFiles.push(path.join(OUTPUT_DIR, file));
  }
  for (const file of tsFiles) {
    await tsFormatter(file);
  }
}
