import {
  concat,
  type Hex,
  encodePacked as abiEncodePacked,
  type Address,
} from "viem";
import { format } from "prettier";
import { OUTPUT_DIR } from "./consts";
import path from "path";

export const _PRE_PARAM = 1n << 127n;
export const _SHARES_MASK = 1n << 126n;
export const _UNSAFE_AMOUNT = 1n << 125n;

export function shiftLeft(value: bigint | number, bits: number): bigint {
  return BigInt(value) << BigInt(bits);
}

export function shiftRight(value: bigint | number, bits: number): bigint {
  return BigInt(value) >> BigInt(bits);
}

export function uint8(value: number | bigint): number {
  return Number(BigInt(value) & 0xffn);
}

export function uint16(value: number | bigint): number {
  return Number(BigInt(value) & 0xffffn);
}

export function uint32(value: number | bigint): number {
  return Number(BigInt(value) & 0xffffffffn);
}

export function uint64(value: number | bigint): bigint {
  return BigInt(value) & ((1n << 64n) - 1n);
}

export function uint112(value: number | bigint): bigint {
  return BigInt(value) & ((1n << 112n) - 1n);
}

export function uint128(value: number | bigint): bigint {
  return BigInt(value) & ((1n << 128n) - 1n);
}

export function uint256(value: number | bigint): bigint {
  return BigInt(value) & ((1n << 256n) - 1n);
}

export function encodePacked(types: string[], values: any[]): Uint8Array {
  if (types.length !== values.length) {
    throw new Error("Types and values arrays must have the same length");
  }

  const result = abiEncodePacked(types, values);
  return Uint8Array.fromHex(result.slice(2));
}

export function generateAmountBitmap(
  amount: bigint,
  preParam: boolean,
  useShares: boolean,
  unsafe: boolean
): bigint {
  let am = amount;
  if (preParam) am = uint128((am & ~BigInt(_PRE_PARAM)) | _PRE_PARAM);
  if (useShares) am = uint128((am & ~BigInt(_SHARES_MASK)) | _SHARES_MASK);
  if (unsafe) am = uint128((am & ~BigInt(_UNSAFE_AMOUNT)) | _UNSAFE_AMOUNT);
  return am;
}

export function setOverrideAmount(amount: bigint, preParam: boolean): bigint {
  let am = uint128(amount);
  if (preParam) am = uint128((am & ~BigInt(_PRE_PARAM)) | shiftLeft(1n, 127));
  return am;
}

export function getMorphoCollateral(market: any): Address {
  const slice = market.slice(20, 40);
  return `0x${Buffer.from(slice).toString("hex")}` as Address;
}

export function getMorphoLoanAsset(market: any): Address {
  const slice = market.slice(0, 20);
  return `0x${Buffer.from(slice).toString("hex")}` as Address;
}

export function newbytes(length: number): Hex {
  return ("0x" + "0".repeat(length * 2)) as Hex;
}

export function bytes(value: Hex): Hex {
  return value;
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
