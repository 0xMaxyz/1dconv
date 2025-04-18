import { type Hex, type Address } from "viem";
export declare const _PRE_PARAM: bigint;
export declare const _SHARES_MASK: bigint;
export declare const _UNSAFE_AMOUNT: bigint;
export declare function shiftLeft(value: bigint | number, bits: number): bigint;
export declare function shiftRight(value: bigint | number, bits: number): bigint;
export declare function uint8(value: number | bigint): number;
export declare function uint16(value: number | bigint): number;
export declare function uint32(value: number | bigint): number;
export declare function uint64(value: number | bigint): bigint;
export declare function uint112(value: number | bigint): bigint;
export declare function uint128(value: number | bigint): bigint;
export declare function uint256(value: number | bigint): bigint;
export declare function encodePacked(types: string[], values: any[]): Hex;
export declare function generateAmountBitmap(amount: bigint, useShares: boolean, unsafe: boolean): bigint;
export declare function getMorphoCollateral(market: Hex): Address;
export declare function getMorphoLoanAsset(market: Hex): Address;
export declare function newbytes(length: number): Hex;
export declare function bytes(value: Hex): Hex;
