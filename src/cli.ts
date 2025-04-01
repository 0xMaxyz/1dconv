#!/usr/bin/env node
import { orchestrate } from "./orchestrate";
import path from "path";

async function main() {
  const args = process.argv.slice(2);
  console.log(
    `
**************************************************************************
*                                                                        *
*        d888   8888888b.  8888888888 888    88888888888     d8888       *
*       d8888   888  "Y88b 888        888        888        d88888       *
*         888   888    888 888        888        888       d88P888       *
*         888   888    888 8888888    888        888      d88P 888       *
*         888   888    888 888        888        888     d88P  888       *
*         888   888    888 888        888        888    d88P   888       *
*         888   888  .d88P 888        888        888   d8888888888       *
*       8888888 8888888P"  8888888888 88888888   888  d88P     888       *          
*                                                                        *
*                                                                        *
*                        CALLDATA LIBRARY PARSER                         *
*                                                                        *
**************************************************************************
                           
`
  );
  const usage =
    "Usage: bun run cli.ts <calldataLibPath> [outputDir] [--run-tests] [--port <port>] [--test-count <count>] [--verbose]";

  if (args.length < 1) {
    console.error(usage);
    process.exit(1);
  }

  // Parse flags
  let runTests = false;
  let calldataLibPath: string | undefined;
  let outputDir: string | undefined;
  let port: number | undefined;
  let testCount: number | undefined;
  let verbose = false;
  // Process arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--run-tests") {
      runTests = true;
      continue;
    }

    if (arg === "--verbose") {
      verbose = true;
      continue;
    }

    if (arg === "--port" && i + 1 < args.length && args[i + 1]) {
      port = parseInt(args[i + 1]!);
      i++; // Skip the next argument (port number)
      continue;
    }

    if (arg === "--test-count" && i + 1 < args.length && args[i + 1]) {
      testCount = parseInt(args[i + 1]!);
      i++; // Skip the next argument (test count)
      continue;
    }

    // If we haven't set the calldataLibPath yet, this argument is the input file
    if (!calldataLibPath) {
      calldataLibPath = arg;
      continue;
    }

    // If we haven't set the outputDir yet, this argument is the output directory
    if (!outputDir) {
      outputDir = arg;
      continue;
    }
  }

  // Ensure we have a valid calldataLibPath
  if (!calldataLibPath) {
    console.error("Error: Missing calldataLibPath");
    console.error(usage);
    process.exit(1);
  }

  // absolute paths
  const resolvedCalldataLibPath = path.resolve(calldataLibPath);

  // default output dir
  const resolvedOutputDir = outputDir
    ? path.resolve(outputDir)
    : path.resolve("./data/output");

  // Debug
  if (verbose) {
    console.log(`Input file: ${resolvedCalldataLibPath}`);
    console.log(`Output directory: ${resolvedOutputDir}`);
  }

  try {
    await orchestrate({
      calldataLibPath: resolvedCalldataLibPath,
      outputDir: resolvedOutputDir,
      runTests,
      port,
      testCount,
      verbose,
    });
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
