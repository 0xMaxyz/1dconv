
  import { type Hex, type Address, encodePacked } from "viem";
  import { uint128, uint8, uint112, uint16, _PRE_PARAM, _SHARES_MASK, _UNSAFE_AMOUNT, generateAmountBitmap, setOverrideAmount } from "../../src/utils.ts";
  export enum SweepType {
  VALIDATE = "VALIDATE",
  BALANCE = "BALANCE",
  AMOUNT = "AMOUNT",
}

export enum TransferIds {
  TRANSFER_FROM = 0,
  SWEEP = 1,
  WRAP_NATIVE = 2,
  UNWRAP_WNATIVE = 3,
  PERMIT2_TRANSFER_FROM = 4
}

export enum PermitIds {
  TOKEN_PERMIT = 0,
  AAVE_V3_CREDIT_PERMIT = 1,
  ALLOW_CREDIT_PERMIT = 2
}

export enum LenderIds {
  UP_TO_AAVE_V3 = 1000,
  UP_TO_AAVE_V2 = 2000,
  UP_TO_COMPOUND_V3 = 3000,
  UP_TO_COMPOUND_V2 = 4000,
  UP_TO_MORPHO = 5000
}

export enum LenderOps {
  DEPOSIT = 0,
  BORROW = 1,
  REPAY = 2,
  WITHDRAW = 3,
  DEPOSIT_LENDING_TOKEN = 4,
  WITHDRAW_LENDING_TOKEN = 5
}

export enum FlashLoanIds {
  MORPHO = 0,
  BALANCER_V2 = 1,
  AAVE_V3 = 2,
  AAVE_V2 = 3
}

export enum ERC4646Ids {
  DEPOSIT = 0,
  WITHDRAW = 1
}

export enum ComposerCommands {
  SWAPS = 0x20,
  EXT_CALL = 0x40,
  LENDING = 0x60,
  TRANSFERS = 0x80,
  PERMIT = 0xA0,
  FLASH_LOAN = 0xC0,
  ERC4646 = 0xE0
}

export function transferIn(asset: Address, receiver: Address, amount: bigint): Hex {
return encodePacked(['uint8', 'uint8', 'address', 'address', 'uint112'], [uint8(ComposerCommands.TRANSFERS), uint8(TransferIds.TRANSFER_FROM), asset, receiver, uint112(amount)]);}

export function sweep(asset: Address, receiver: Address, amount: bigint, sweepType: any): Hex {
return encodePacked(['uint8', 'uint8', 'address', 'address', 'uint8', 'uint112'], [uint8(ComposerCommands.TRANSFERS), uint8(TransferIds.SWEEP), asset, receiver, sweepType, uint112(amount)]);}

export function wrap(amount: bigint): Hex {
return encodePacked(['uint8', 'uint8', 'uint112'], [uint8(ComposerCommands.TRANSFERS), uint8(TransferIds.WRAP_NATIVE), uint112(amount)]);}

export function unwrap(receiver: Address, amount: bigint, sweepType: any): Hex {
return encodePacked(['uint8', 'uint8', 'address', 'uint8', 'uint112'], [uint8(ComposerCommands.TRANSFERS), uint8(TransferIds.UNWRAP_WNATIVE), receiver, sweepType, uint112(amount)]);}

export function encodeFlashLoan(asset: Address, amount: bigint, pool: Address, poolType: number, poolId: number, data: any): Hex {
return encodePacked(['uint8', 'uint8', 'uint8', 'address', 'address', 'uint112', 'uint16', 'bytes'], [uint8(ComposerCommands.FLASH_LOAN), uint8(poolType), poolId, asset, pool, uint112(amount), uint16(data.length), data]);}

export function morphoDepositCollateral(market: any, assets: bigint, receiver: Address, data: any, morphoB: any): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'bytes', 'uint128', 'address', 'address', 'uint16', 'bytes'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.DEPOSIT), uint16(LenderIds.UP_TO_MORPHO), market, uint128(assets), receiver, morphoB, uint16(data.length), data]);}

export function morphoDeposit(market: any, isShares: boolean, assets: any, receiver: Address, data: any, morphoB: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'bytes', 'uint128', 'address', 'address', 'uint16', 'bytes'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.DEPOSIT_LENDING_TOKEN), uint16(LenderIds.UP_TO_MORPHO), market, generateAmountBitmap(uint128(assets),false,isShares,false), receiver, morphoB, uint16(data.length), data]);}

export function erc4646Deposit(asset: Address, vault: Address, isShares: boolean, assets: any, receiver: Address): Hex {
return encodePacked(['uint8', 'uint8', 'address', 'address', 'uint128', 'address'], [uint8(ComposerCommands.ERC4646), uint8(0), asset, vault, generateAmountBitmap(uint128(assets),false,isShares,false), receiver]);}

export function erc4646Withdraw(vault: Address, isShares: boolean, assets: any, receiver: Address): Hex {
return encodePacked(['uint8', 'uint8', 'address', 'uint128', 'address'], [uint8(ComposerCommands.ERC4646), uint8(1), vault, generateAmountBitmap(uint128(assets),false,isShares,false), receiver]);}

export function morphoWithdraw(market: any, isShares: boolean, assets: any, receiver: Address, morphoB: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'bytes', 'uint128', 'address', 'address'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.WITHDRAW_LENDING_TOKEN), uint16(LenderIds.UP_TO_MORPHO), market, generateAmountBitmap(uint128(assets),false,isShares,false), receiver, morphoB]);}

export function morphoWithdrawCollateral(market: any, assets: any, receiver: Address, morphoB: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'bytes', 'uint128', 'address', 'address'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.WITHDRAW), uint16(LenderIds.UP_TO_MORPHO), market, uint128(assets), receiver, morphoB]);}

export function morphoBorrow(market: any, isShares: boolean, assets: any, receiver: Address, morphoB: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'bytes', 'uint128', 'address', 'address'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.BORROW), uint16(LenderIds.UP_TO_MORPHO), market, generateAmountBitmap(uint128(assets),false,isShares,false), receiver, morphoB]);}

export function morphoRepay(market: any, isShares: boolean, unsafe: any, assets: bigint, receiver: Address, data: any, morphoB: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'bytes', 'uint128', 'address', 'address', 'uint16', 'bytes'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.REPAY), uint16(LenderIds.UP_TO_MORPHO), market, generateAmountBitmap(uint128(assets),false,isShares,unsafe), receiver, morphoB, uint16(data.length), data]);}

export function encodeAaveDeposit(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, pool: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'address'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.DEPOSIT), uint16(LenderIds.UP_TO_AAVE_V3-1), token, setOverrideAmount(amount,overrideAmount), receiver, pool]);}

export function encodeAaveBorrow(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, mode: bigint, pool: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'uint8', 'address'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.BORROW), uint16(LenderIds.UP_TO_AAVE_V3-1), token, setOverrideAmount(amount,overrideAmount), receiver, uint8(mode), pool]);}

export function encodeAaveRepay(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, mode: bigint, dToken: Address, pool: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'uint8', 'address', 'address'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.REPAY), uint16(LenderIds.UP_TO_AAVE_V3-1), token, setOverrideAmount(amount,overrideAmount), receiver, uint8(mode), dToken, pool]);}

export function encodeAaveWithdraw(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, aToken: Address, pool: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'address', 'address'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.WITHDRAW), uint16(LenderIds.UP_TO_AAVE_V3-1), token, setOverrideAmount(amount,overrideAmount), receiver, aToken, pool]);}

export function encodeAaveV2Deposit(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, pool: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'address'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.DEPOSIT), uint16(LenderIds.UP_TO_AAVE_V2-1), token, setOverrideAmount(amount,overrideAmount), receiver, pool]);}

export function encodeAaveV2Borrow(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, mode: bigint, pool: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'uint8', 'address'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.BORROW), uint16(LenderIds.UP_TO_AAVE_V2-1), token, setOverrideAmount(amount,overrideAmount), receiver, uint8(mode), pool]);}

export function encodeAaveV2Repay(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, mode: bigint, dToken: Address, pool: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'uint8', 'address', 'address'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.REPAY), uint16(LenderIds.UP_TO_AAVE_V2-1), token, setOverrideAmount(amount,overrideAmount), receiver, uint8(mode), dToken, pool]);}

export function encodeAaveV2Withdraw(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, aToken: Address, pool: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'address', 'address'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.WITHDRAW), uint16(LenderIds.UP_TO_AAVE_V2-1), token, setOverrideAmount(amount,overrideAmount), receiver, aToken, pool]);}

export function encodeCompoundV3Deposit(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, comet: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'address'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.DEPOSIT), uint16(LenderIds.UP_TO_COMPOUND_V3-1), token, setOverrideAmount(amount,overrideAmount), receiver, comet]);}

export function encodeCompoundV3Borrow(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, comet: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'address'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.BORROW), uint16(LenderIds.UP_TO_COMPOUND_V3-1), token, setOverrideAmount(amount,overrideAmount), receiver, comet]);}

export function encodeCompoundV3Repay(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, comet: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'address'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.REPAY), uint16(LenderIds.UP_TO_COMPOUND_V3-1), token, setOverrideAmount(amount,overrideAmount), receiver, comet]);}

export function encodeCompoundV3Withdraw(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, comet: Address, isBase: boolean): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'uint8', 'address'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.WITHDRAW), uint16(LenderIds.UP_TO_COMPOUND_V3-1), token, setOverrideAmount(amount,overrideAmount), receiver, isBase?uint8(1):uint8(0), comet]);}

export function encodeCompoundV2Deposit(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, cToken: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'address'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.DEPOSIT), uint16(LenderIds.UP_TO_COMPOUND_V2-1), token, setOverrideAmount(amount,overrideAmount), receiver, cToken]);}

export function encodeCompoundV2Borrow(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, cToken: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'address'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.BORROW), uint16(LenderIds.UP_TO_COMPOUND_V2-1), token, setOverrideAmount(amount,overrideAmount), receiver, cToken]);}

export function encodeCompoundV2Repay(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, cToken: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'address'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.REPAY), uint16(LenderIds.UP_TO_COMPOUND_V2-1), token, setOverrideAmount(amount,overrideAmount), receiver, cToken]);}

export function encodeCompoundV2Withdraw(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, cToken: Address): Hex {
return encodePacked(['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'address'], [uint8(ComposerCommands.LENDING), uint8(LenderOps.WITHDRAW), uint16(LenderIds.UP_TO_COMPOUND_V2-1), token, setOverrideAmount(amount,overrideAmount), receiver, cToken]);}

