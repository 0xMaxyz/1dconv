#!/usr/bin/env node
import { converter } from "./converter";
import path from "path";
import { handleFiles } from "./fileHandler";
import {
  CALLDATA_LIB_URL,
  INPUT_DIR,
  OUTPUT_DIR,
  CALLDATA_LIB_PATH,
} from "./consts";
import { LibCache } from "./libCache";
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
    "Usage: bun run cli.ts [outputDir] [--run-tests] [--test-count <count>] [--verbose]";

  // Parse flags
  let runTests = false;
  let outputDir: string | undefined;
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

    if (arg === "--test-count" && i + 1 < args.length && args[i + 1]) {
      testCount = parseInt(args[i + 1]!);
      i++; // Skip the next argument (test count)
      continue;
    }

    // If we haven't set the outputDir yet, this argument is the output directory
    if (!outputDir) {
      outputDir = arg;
      continue;
    }
  }

  // default output dir
  const resolvedOutputDir = outputDir
    ? path.resolve(outputDir)
    : path.resolve(OUTPUT_DIR);

  // Debug
  if (verbose) {
    console.log(`Output directory: ${resolvedOutputDir}`);
  }

  try {
    console.log("Downloading calldatalib from git repository ...\n");
    // download the file from git repo
    await handleFiles({
      mainFile: CALLDATA_LIB_URL,
      verbose,
    });

    // Then process them
    await converter({
      calldataLibPath: path.resolve(
        path.join(INPUT_DIR, path.basename(CALLDATA_LIB_PATH))
      ),
      outputDir: resolvedOutputDir,
      runTests,
      testCount,
      verbose,
    });
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    LibCache.getInstance().clearCache();
  }
}

main();
