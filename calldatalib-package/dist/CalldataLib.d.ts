import { type Address } from "viem";
export declare enum SweepType {
    VALIDATE = 0,
    AMOUNT = 1
}
export declare enum DexPayConfig {
    CALLER_PAYS = 0,
    CONTRACT_PAYS = 1,
    PRE_FUND = 2,
    FLASH = 3
}
export declare enum DodoSelector {
    SELL_BASE = 0,
    SELL_QUOTE = 1
}
export declare enum TransferIds {
    TRANSFER_FROM = 0,
    SWEEP = 1,
    WRAP_NATIVE = 2,
    UNWRAP_WNATIVE = 3,
    PERMIT2_TRANSFER_FROM = 4,
    APPROVE = 5
}
export declare enum PermitIds {
    TOKEN_PERMIT = 0,
    AAVE_V3_CREDIT_PERMIT = 1,
    ALLOW_CREDIT_PERMIT = 2
}
export declare enum LenderIds {
    UP_TO_AAVE_V3 = 1000,
    UP_TO_AAVE_V2 = 2000,
    UP_TO_COMPOUND_V3 = 3000,
    UP_TO_COMPOUND_V2 = 4000,
    UP_TO_MORPHO = 5000
}
export declare enum LenderOps {
    DEPOSIT = 0,
    BORROW = 1,
    REPAY = 2,
    WITHDRAW = 3,
    DEPOSIT_LENDING_TOKEN = 4,
    WITHDRAW_LENDING_TOKEN = 5
}
export declare enum FlashLoanIds {
    MORPHO = 0,
    BALANCER_V2 = 1,
    AAVE_V3 = 2,
    AAVE_V2 = 3
}
export declare enum ERC4646Ids {
    DEPOSIT = 0,
    WITHDRAW = 1
}
export declare enum Gen2025ActionIds {
    UNLOCK = 0,
    UNI_V4_TAKE = 1,
    UNI_V4_SETTLE = 2,
    UNI_V4_SYNC = 3,
    BAL_V3_TAKE = 4,
    BAL_V3_SETTLE = 5
}
export declare enum ComposerCommands {
    SWAPS = 32,
    EXT_CALL = 64,
    LENDING = 96,
    TRANSFERS = 128,
    PERMIT = 160,
    FLASH_LOAN = 192,
    ERC4646 = 224,
    GEN_2025_SINGELTONS = 225
}
export declare enum ForwarderCommands {
    EXT_CALL = 64,
    ASSET_HANDLING = 128
}
export declare enum DexTypeMappings {
    UNISWAP_V3_ID = 0,
    IZI_ID = 1,
    UNISWAP_V4_ID = 2,
    BALANCER_V3_ID = 4,
    BALANCER_V2_ID = 3,
    UNISWAP_V2_ID = 6,
    UNISWAP_V2_FOT_ID = 7,
    CURVE_V1_STANDARD_ID = 60,
    CURVE_FORK_ID = 61,
    UNISWAP_V2_MAX_ID = 150,
    CURVE_RECEIVED_ID = 150,
    WOO_FI_ID = 155,
    LB_ID = 160,
    GMX_ID = 170,
    KTX_ID = 171,
    MAX_GMX_ID = 173,
    DODO_ID = 180,
    SYNC_SWAP_ID = 190,
    NATIVE_WRAP_ID = 254
}
export declare enum DexForkMappings {
    UNISWAP_V3 = 0,
    IZI = 0,
    ANY_V3 = 255,
    ANY_IZI = 255,
    UNISWAP_V4 = 0,
    BALANCER_V3 = 0,
    UNISWAP_V2 = 0
}
export declare function permit2TransferFrom(token: Address, receiver: Address, amount: bigint): Uint8Array;
export declare function nextGenDexUnlock(singleton: Address, id: bigint, d: Uint8Array): Uint8Array;
export declare function balancerV3FlashLoan(singleton: Address, poolId: bigint, asset: Address, receiver: Address, amount: bigint, flashData: Uint8Array): Uint8Array;
export declare function balancerV3FlashLoanData(take: Uint8Array, flashData: Uint8Array, settle: Uint8Array): Uint8Array;
export declare function uniswapV4FlashLoan(singleton: Address, poolId: bigint, asset: Address, receiver: Address, amount: bigint, flashData: Uint8Array): Uint8Array;
export declare function uniswapV4FlashLoanData(take: Uint8Array, sync: Uint8Array, flashData: Uint8Array, settle: Uint8Array): Uint8Array;
export declare function balancerV3Take(singleton: Address, asset: Address, receiver: Address, amount: bigint): Uint8Array;
export declare function uniswapV4Sync(singleton: Address, asset: Address): Uint8Array;
export declare function uniswapV4Take(singleton: Address, asset: Address, receiver: Address, amount: bigint): Uint8Array;
export declare function swapHead(amount: bigint, amountOutMin: bigint, assetIn: Address, preParam: boolean): Uint8Array;
export declare function attachBranch(data: Uint8Array, hops: bigint, splits: bigint, splitsData: Uint8Array): Uint8Array;
export declare function uniswapV2StyleSwap(tokenOut: Address, receiver: Address, forkId: bigint, pool: Address, feeDenom: bigint, cfg: any, flashCalldata: Uint8Array): Uint8Array;
export declare function uniswapV4StyleSwap(currentData: Uint8Array, tokenOut: Address, receiver: Address, manager: Address, fee: number, tickSpacing: number, hooks: Address, hookData: Uint8Array, cfg: any): Uint8Array;
export declare function balancerV2StyleSwap(currentData: Uint8Array, tokenOut: Address, receiver: Address, poolId: Uint8Array, balancerVault: Address, cfg: any): Uint8Array;
export declare function lbStyleSwap(currentData: Uint8Array, tokenOut: Address, receiver: Address, pool: Address, swapForY: boolean, cfg: any): Uint8Array;
export declare function syncSwapStyleSwap(currentData: Uint8Array, tokenOut: Address, receiver: Address, pool: Address, cfg: any): Uint8Array;
export declare function uniswapV3StyleSwap(currentData: Uint8Array, tokenOut: Address, receiver: Address, forkId: bigint, pool: Address, feeTier: bigint, cfg: any, flashCalldata: Uint8Array): Uint8Array;
export declare function izumiV3StyleSwap(currentData: Uint8Array, tokenOut: Address, receiver: Address, forkId: bigint, pool: Address, feeTier: bigint, cfg: any, flashCalldata: Uint8Array): Uint8Array;
export declare function balancerV3StyleSwap(currentData: Uint8Array, tokenOut: Address, receiver: Address, balancerV3Vault: Address, pool: Address, cfg: any, poolUserData: Uint8Array): Uint8Array;
export declare function izumiStyleSwap(tokenOut: Address, receiver: Address, forkId: bigint, pool: Address, feeTier: bigint, cfg: any, flashCalldata: Uint8Array): Uint8Array;
export declare function dodoStyleSwap(currentData: Uint8Array, tokenOut: Address, receiver: Address, pool: Address, selector: any, poolId: bigint, cfg: any, flashCalldata: Uint8Array): Uint8Array;
export declare function wooStyleSwap(currentData: Uint8Array, tokenOut: Address, receiver: Address, pool: Address, cfg: any): Uint8Array;
export declare function gmxStyleSwap(currentData: Uint8Array, tokenOut: Address, receiver: Address, pool: Address, cfg: any): Uint8Array;
export declare function curveStyleSwap(tokenOut: Address, receiver: Address, pool: Address, indexIn: bigint, indexOut: bigint, selectorId: bigint, cfg: any): Uint8Array;
export declare function curveNGStyleSwap(tokenOut: Address, receiver: Address, pool: Address, indexIn: bigint, indexOut: bigint, selectorId: bigint, cfg: any): Uint8Array;
export declare function nextGenDexSettle(singleton: Address, nativeAmount: bigint): Uint8Array;
export declare function nextGenDexSettleBalancer(singleton: Address, asset: Address, amountHint: bigint): Uint8Array;
export declare function transferIn(asset: Address, receiver: Address, amount: bigint): Uint8Array;
export declare function sweep(asset: Address, receiver: Address, amount: bigint, sweepType: any): Uint8Array;
export declare function wrap(amount: bigint, wrapTarget: Address): Uint8Array;
export declare function encodeApprove(asset: Address, target: Address): Uint8Array;
export declare function unwrap(target: Address, receiver: Address, amount: bigint, sweepType: any): Uint8Array;
export declare function encodeFlashLoan(asset: Address, amount: bigint, pool: Address, poolType: number, poolId: number, data: Uint8Array): Uint8Array;
export declare function encodeUint8AndBytes(poolId: number, data: Uint8Array): Uint8Array;
export declare function encodeMorphoMarket(loanToken: Address, collateralToken: Address, oracle: Address, irm: Address, lltv: bigint): Uint8Array;
export declare function morphoDepositCollateral(market: Uint8Array, assets: bigint, receiver: Address, data: Uint8Array, morphoB: Address, pId: bigint): Uint8Array;
export declare function morphoDeposit(market: Uint8Array, isShares: boolean, assets: bigint, receiver: Address, data: Uint8Array, morphoB: Address, pId: bigint): Uint8Array;
export declare function erc4646Deposit(asset: Address, vault: Address, isShares: boolean, assets: bigint, receiver: Address): Uint8Array;
export declare function erc4646Withdraw(vault: Address, isShares: boolean, assets: bigint, receiver: Address): Uint8Array;
export declare function morphoWithdraw(market: Uint8Array, isShares: boolean, assets: bigint, receiver: Address, morphoB: Address): Uint8Array;
export declare function morphoWithdrawCollateral(market: Uint8Array, assets: bigint, receiver: Address, morphoB: Address): Uint8Array;
export declare function morphoBorrow(market: Uint8Array, isShares: boolean, assets: bigint, receiver: Address, morphoB: Address): Uint8Array;
export declare function morphoRepay(market: Uint8Array, isShares: boolean, unsafe: boolean, assets: bigint, receiver: Address, data: Uint8Array, morphoB: Address, pId: bigint): Uint8Array;
export declare function encodeAaveDeposit(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, pool: Address): Uint8Array;
export declare function encodeAaveBorrow(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, mode: bigint, pool: Address): Uint8Array;
export declare function encodeAaveRepay(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, mode: bigint, dToken: Address, pool: Address): Uint8Array;
export declare function encodeAaveWithdraw(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, aToken: Address, pool: Address): Uint8Array;
export declare function encodeAaveV2Deposit(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, pool: Address): Uint8Array;
export declare function encodeAaveV2Borrow(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, mode: bigint, pool: Address): Uint8Array;
export declare function encodeAaveV2Repay(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, mode: bigint, dToken: Address, pool: Address): Uint8Array;
export declare function encodeAaveV2Withdraw(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, aToken: Address, pool: Address): Uint8Array;
export declare function encodeCompoundV3Deposit(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, comet: Address): Uint8Array;
export declare function encodeCompoundV3Borrow(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, comet: Address): Uint8Array;
export declare function encodeCompoundV3Repay(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, comet: Address): Uint8Array;
export declare function encodeCompoundV3Withdraw(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, comet: Address, isBase: boolean): Uint8Array;
export declare function encodeCompoundV2Deposit(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, cToken: Address): Uint8Array;
export declare function encodeCompoundV2Borrow(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, cToken: Address): Uint8Array;
export declare function encodeCompoundV2Repay(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, cToken: Address): Uint8Array;
export declare function encodeCompoundV2Withdraw(token: Address, overrideAmount: boolean, amount: bigint, receiver: Address, cToken: Address): Uint8Array;
