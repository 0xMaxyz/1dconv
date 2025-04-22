import { type Hex, type Address } from "viem";
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
export declare function encodePermit2TransferFrom(token: Address, receiver: Address, amount: bigint): Hex;
export declare function encodeNextGenDexUnlock(singleton: Address, id: bigint, d: Hex): Hex;
export declare function encodeBalancerV3FlashLoan(singleton: Address, poolId: bigint, asset: Address, receiver: Address, amount: bigint, flashData: Hex): Hex;
export declare function encodeBalancerV3FlashLoanData(take: Hex, flashData: Hex, settle: Hex): Hex;
export declare function encodeUniswapV4FlashLoan(singleton: Address, poolId: bigint, asset: Address, receiver: Address, amount: bigint, flashData: Hex): Hex;
export declare function encodeUniswapV4FlashLoanData(take: Hex, sync: Hex, flashData: Hex, settle: Hex): Hex;
export declare function encodeBalancerV3Take(singleton: Address, asset: Address, receiver: Address, amount: bigint): Hex;
export declare function encodeUniswapV4Sync(singleton: Address, asset: Address): Hex;
export declare function encodeUniswapV4Take(singleton: Address, asset: Address, receiver: Address, amount: bigint): Hex;
export declare function swapHead(amount: bigint, amountOutMin: bigint, assetIn: Address): Hex;
export declare function attachBranch(data: Hex, hops: bigint, splits: bigint, splitsData: Hex): Hex;
export declare function encodeUniswapV2StyleSwap(tokenOut: Address, receiver: Address, forkId: bigint, pool: Address, feeDenom: bigint, cfg: any, flashCalldata: Hex): Hex;
export declare function encodeUniswapV4StyleSwap(currentData: Hex, tokenOut: Address, receiver: Address, manager: Address, fee: number, tickSpacing: number, hooks: Address, hookData: Hex, cfg: any): Hex;
export declare function encodeBalancerV2StyleSwap(currentData: Hex, tokenOut: Address, receiver: Address, poolId: Hex, balancerVault: Address, cfg: any): Hex;
export declare function encodeLbStyleSwap(currentData: Hex, tokenOut: Address, receiver: Address, pool: Address, swapForY: boolean, cfg: any): Hex;
export declare function encodeSyncSwapStyleSwap(currentData: Hex, tokenOut: Address, receiver: Address, pool: Address, cfg: any): Hex;
export declare function encodeUniswapV3StyleSwap(currentData: Hex, tokenOut: Address, receiver: Address, forkId: bigint, pool: Address, feeTier: bigint, cfg: any, flashCalldata: Hex): Hex;
export declare function encodeIzumiStyleSwap(currentData: Hex, tokenOut: Address, receiver: Address, forkId: bigint, pool: Address, feeTier: bigint, cfg: any, flashCalldata: Hex): Hex;
export declare function encodeBalancerV3StyleSwap(currentData: Hex, tokenOut: Address, receiver: Address, balancerV3Vault: Address, pool: Address, cfg: any, poolUserData: Hex): Hex;
export declare function encodeDodoStyleSwap(currentData: Hex, tokenOut: Address, receiver: Address, pool: Address, selector: any, poolId: bigint, cfg: any, flashCalldata: Hex): Hex;
export declare function encodeWooStyleSwap(currentData: Hex, tokenOut: Address, receiver: Address, pool: Address, cfg: any): Hex;
export declare function encodeGmxStyleSwap(currentData: Hex, tokenOut: Address, receiver: Address, pool: Address, cfg: any): Hex;
export declare function encodeKtxStyleSwap(currentData: Hex, tokenOut: Address, receiver: Address, pool: Address, cfg: any): Hex;
export declare function encodeCurveStyleSwap(tokenOut: Address, receiver: Address, pool: Address, indexIn: bigint, indexOut: bigint, selectorId: bigint, cfg: any): Hex;
export declare function encodeCurveNGStyleSwap(tokenOut: Address, receiver: Address, pool: Address, indexIn: bigint, indexOut: bigint, selectorId: bigint, cfg: any): Hex;
export declare function encodeNextGenDexSettle(singleton: Address, nativeAmount: bigint): Hex;
export declare function encodeNextGenDexSettleBalancer(singleton: Address, asset: Address, amountHint: bigint): Hex;
export declare function encodeTransferIn(asset: Address, receiver: Address, amount: bigint): Hex;
export declare function encodeSweep(asset: Address, receiver: Address, amount: bigint, sweepType: any): Hex;
export declare function encodeWrap(amount: bigint, wrapTarget: Address): Hex;
export declare function encodeApprove(asset: Address, target: Address): Hex;
export declare function encodeUnwrap(target: Address, receiver: Address, amount: bigint, sweepType: any): Hex;
export declare function encodeBalancerV2FlashLoan(asset: Address, amount: bigint, poolId: number, data: Hex): Hex;
export declare function encodeFlashLoan(asset: Address, amount: bigint, pool: Address, poolType: number, poolId: number, data: Hex): Hex;
export declare function encodeUint8AndBytes(poolId: number, data: Hex): Hex;
export declare function encodeMorphoMarket(loanToken: Address, collateralToken: Address, oracle: Address, irm: Address, lltv: bigint): Hex;
export declare function encodeMorphoDepositCollateral(market: Hex, assets: bigint, receiver: Address, data: Hex, morphoB: Address, pId: bigint): Hex;
export declare function encodeMorphoDeposit(market: Hex, isShares: boolean, assets: bigint, receiver: Address, data: Hex, morphoB: Address, pId: bigint): Hex;
export declare function encodeErc4646Deposit(asset: Address, vault: Address, isShares: boolean, assets: bigint, receiver: Address): Hex;
export declare function encodeErc4646Withdraw(vault: Address, isShares: boolean, assets: bigint, receiver: Address): Hex;
export declare function encodeMorphoWithdraw(market: Hex, isShares: boolean, assets: bigint, receiver: Address, morphoB: Address): Hex;
export declare function encodeMorphoWithdrawCollateral(market: Hex, assets: bigint, receiver: Address, morphoB: Address): Hex;
export declare function encodeMorphoBorrow(market: Hex, isShares: boolean, assets: bigint, receiver: Address, morphoB: Address): Hex;
export declare function encodeMorphoRepay(market: Hex, isShares: boolean, unsafe: boolean, assets: bigint, receiver: Address, data: Hex, morphoB: Address, pId: bigint): Hex;
export declare function encodeAaveDeposit(token: Address, amount: bigint, receiver: Address, pool: Address): Hex;
export declare function encodeAaveBorrow(token: Address, amount: bigint, receiver: Address, mode: bigint, pool: Address): Hex;
export declare function encodeAaveRepay(token: Address, amount: bigint, receiver: Address, mode: bigint, dToken: Address, pool: Address): Hex;
export declare function encodeAaveWithdraw(token: Address, amount: bigint, receiver: Address, aToken: Address, pool: Address): Hex;
export declare function encodeAaveV2Deposit(token: Address, amount: bigint, receiver: Address, pool: Address): Hex;
export declare function encodeAaveV2Borrow(token: Address, amount: bigint, receiver: Address, mode: bigint, pool: Address): Hex;
export declare function encodeAaveV2Repay(token: Address, amount: bigint, receiver: Address, mode: bigint, dToken: Address, pool: Address): Hex;
export declare function encodeAaveV2Withdraw(token: Address, amount: bigint, receiver: Address, aToken: Address, pool: Address): Hex;
export declare function encodeCompoundV3Deposit(token: Address, amount: bigint, receiver: Address, comet: Address): Hex;
export declare function encodeCompoundV3Borrow(token: Address, amount: bigint, receiver: Address, comet: Address): Hex;
export declare function encodeCompoundV3Repay(token: Address, amount: bigint, receiver: Address, comet: Address): Hex;
export declare function encodeCompoundV3Withdraw(token: Address, amount: bigint, receiver: Address, comet: Address, isBase: boolean): Hex;
export declare function encodeCompoundV2Deposit(token: Address, amount: bigint, receiver: Address, cToken: Address): Hex;
export declare function encodeCompoundV2Borrow(token: Address, amount: bigint, receiver: Address, cToken: Address): Hex;
export declare function encodeCompoundV2Repay(token: Address, amount: bigint, receiver: Address, cToken: Address): Hex;
export declare function encodeCompoundV2Withdraw(token: Address, amount: bigint, receiver: Address, cToken: Address): Hex;
