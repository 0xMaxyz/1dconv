import * as fs from "fs";
import type { FunctionDef } from "./types";

/**
 * Parses the CalldataLib.sol file and returns an array of function definitions.
 * @dev only solidity functions with internal visibility, pure and returns are supported
 * @param filePath - The path to the CalldataLib.sol file.
 * @returns An array of function definitions.
 */
export function parseCalldataLib(filePath: string): FunctionDef[] {
  const content = fs.readFileSync(filePath, "utf8");

  const functionRegex =
    /function\s+(\w+)\s*\(([^)]*)\)\s*internal\s+pure\s+returns\s*\(([^)]*)\)/g;
  const functions: FunctionDef[] = [];

  let match;
  while ((match = functionRegex.exec(content)) !== null) {
    const [_, name, params, returnType] = match;
    if (name && params && returnType) {
      const parameters = params
        .split(",")
        .map((param) => param.trim())
        .filter((param) => param)
        .map((param) => {
          const parts = param.split(" ").filter((p) => p);
          if (parts.length !== 2) {
            throw new Error(`Invalid parameter format: ${param}`);
          }
          const [type, name] = parts as [string, string];
          return { type, name };
        });

      functions.push({
        name,
        params: parameters,
        returnType: returnType.trim(),
      });
    }
  }

  return functions;
}
