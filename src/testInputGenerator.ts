import type { FunctionDef, TestInputs } from "./types";

/**
 * Generates test inputs for a given function definition.
 * @param func - The function definition to generate test inputs for.
 * @returns The generated test inputs.
 */
export function generateTestInputs(func: FunctionDef): TestInputs {
  const solidity: string[] = [];
  const typescript: string[] = [];

  func.params.forEach((param) => {
    const { solValue, tsValue } = generateValuePair(param.type);
    solidity.push(solValue);
    typescript.push(tsValue);
  });

  return {
    solidityValues: solidity,
    typescriptValues: typescript,
  };
}

/**
 * Generates a pair of values for a given type.
 * @param type - The type to generate values for.
 * @returns The generated values.
 */
function generateValuePair(type: string): {
  solValue: string;
  tsValue: string;
} {
  // Clean up type
  const cleanType = type
    .replace(" memory", "")
    .replace(" calldata", "")
    .replace(" storage", "")
    .trim();

  // Handle uint types
  if (cleanType.startsWith("uint")) {
    const bits = parseInt(cleanType.replace("uint", "")) || 256;
    // capped at 20 digits
    const num = bits === 256 ? 1e20 : Math.min(1e20, Math.pow(2, bits) - 1);
    return {
      solValue: num.toString(),
      tsValue: `${num}n`,
    };
  }

  // Handle other existing types
  switch (cleanType) {
    case "address":
      return {
        solValue: "0x1de17a0000000000000000000000000000000000",
        tsValue: `"0x1de17a0000000000000000000000000000000000" as Address`,
      };
    case "bytes":
    case "bytes memory":
      return {
        solValue: '"0x1234567890abcdef000000x1234567890abcdef"',
        tsValue: '"0x1234567890abcdef000000x1234567890abcdef" as Hex',
      };
    case "bool":
      return {
        solValue: "true",
        tsValue: "true",
      };
    default:
      throw new Error(`Unsupported parameter type: ${type}`);
  }
}
