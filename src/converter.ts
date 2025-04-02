import * as fs from "fs";
import path from "path";
import type { OrchestrationConfig } from "./types";
import { processImports } from "./parser";
import { generateForgeScript } from "./generateForgeScript";

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
    const tsOutputPath = path.join(outputDir, "tsCall.ts");

    processImports(calldataLibPath, outputDir, verbose);

    // 2. Generate test inputs and Forge script
    console.log("Generating Forge script and test inputs...");
    const { script, inputs } = generateForgeScript(calldataLibPath);
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
