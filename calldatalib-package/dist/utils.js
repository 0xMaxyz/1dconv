import { encodePacked as abiEncodePacked } from "viem";
export const _PRE_PARAM = 1n << 127n;
export const _SHARES_MASK = 1n << 126n;
export const _UNSAFE_AMOUNT = 1n << 125n;
export function shiftLeft(value, bits) {
    return BigInt(value) << BigInt(bits);
}
export function shiftRight(value, bits) {
    return BigInt(value) >> BigInt(bits);
}
export function uint8(value) {
    return Number(BigInt(value) & 0xffn);
}
export function uint16(value) {
    return Number(BigInt(value) & 0xffffn);
}
export function uint32(value) {
    return Number(BigInt(value) & 0xffffffffn);
}
export function uint64(value) {
    return BigInt(value) & ((1n << 64n) - 1n);
}
export function uint112(value) {
    return BigInt(value) & ((1n << 112n) - 1n);
}
export function uint128(value) {
    return BigInt(value) & ((1n << 128n) - 1n);
}
export function uint256(value) {
    return BigInt(value) & ((1n << 256n) - 1n);
}
export function encodePacked(types, values) {
    if (types.length !== values.length) {
        throw new Error("Types and values arrays must have the same length");
    }
    return abiEncodePacked(types, values);
}
export function generateAmountBitmap(amount, useShares, unsafe) {
    let am = amount;
    if (useShares)
        am = uint128((am & ~BigInt(_SHARES_MASK)) | _SHARES_MASK);
    if (unsafe)
        am = uint128((am & ~BigInt(_UNSAFE_AMOUNT)) | _UNSAFE_AMOUNT);
    return am;
}
export function getMorphoCollateral(market) {
    const slice = market.slice(42, 82);
    return `0x${slice}`;
}
export function getMorphoLoanAsset(market) {
    const slice = market.slice(2, 42);
    return `0x${slice}`;
}
export function newbytes(length) {
    return ("0x" + "0".repeat(length * 2));
}
export function bytes(value) {
    return value;
}
