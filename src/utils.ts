import { concat, type Hex, encodePacked as abiEncodePacked } from "viem";

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

export function encodePacked(types: string[], values: any[]): Hex {
  if (types.length !== values.length) {
    throw new Error("Types and values arrays must have the same length");
  }

  return abiEncodePacked(types, values);
}
