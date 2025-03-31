#!/usr/bin/env node
import { orchestrate } from "./orchestrate";
import path from "path";

async function main() {
  const args = process.argv.slice(2);
  const usage = "Usage: bun run cli.ts <calldataLibPath> [outputDir]";

  if (args.length < 1) {
    console.error(usage);
    process.exit(1);
  }

  const calldataLibPath = path.resolve(args[0]);
  const outputDir = args[1] ? path.resolve(args[1]) : path.resolve("./output");

  try {
    await orchestrate({
      calldataLibPath,
      outputDir,
    });
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
