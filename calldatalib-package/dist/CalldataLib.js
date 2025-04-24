// @ts-nocheck
import { zeroAddress } from "viem";
import { encodePacked, uint128, uint8, uint16, uint256, generateAmountBitmap, newbytes, bytes, getMorphoCollateral, getMorphoLoanAsset, } from "./utils";
export var SweepType;
(function (SweepType) {
    SweepType[SweepType["VALIDATE"] = 0] = "VALIDATE";
    SweepType[SweepType["AMOUNT"] = 1] = "AMOUNT";
})(SweepType || (SweepType = {}));
export var DexPayConfig;
(function (DexPayConfig) {
    DexPayConfig[DexPayConfig["CALLER_PAYS"] = 0] = "CALLER_PAYS";
    DexPayConfig[DexPayConfig["CONTRACT_PAYS"] = 1] = "CONTRACT_PAYS";
    DexPayConfig[DexPayConfig["PRE_FUND"] = 2] = "PRE_FUND";
    DexPayConfig[DexPayConfig["FLASH"] = 3] = "FLASH";
})(DexPayConfig || (DexPayConfig = {}));
export var DodoSelector;
(function (DodoSelector) {
    DodoSelector[DodoSelector["SELL_BASE"] = 0] = "SELL_BASE";
    DodoSelector[DodoSelector["SELL_QUOTE"] = 1] = "SELL_QUOTE";
})(DodoSelector || (DodoSelector = {}));
export var TransferIds;
(function (TransferIds) {
    TransferIds[TransferIds["TRANSFER_FROM"] = 0] = "TRANSFER_FROM";
    TransferIds[TransferIds["SWEEP"] = 1] = "SWEEP";
    TransferIds[TransferIds["WRAP_NATIVE"] = 2] = "WRAP_NATIVE";
    TransferIds[TransferIds["UNWRAP_WNATIVE"] = 3] = "UNWRAP_WNATIVE";
    TransferIds[TransferIds["PERMIT2_TRANSFER_FROM"] = 4] = "PERMIT2_TRANSFER_FROM";
    TransferIds[TransferIds["APPROVE"] = 5] = "APPROVE";
})(TransferIds || (TransferIds = {}));
export var PermitIds;
(function (PermitIds) {
    PermitIds[PermitIds["TOKEN_PERMIT"] = 0] = "TOKEN_PERMIT";
    PermitIds[PermitIds["AAVE_V3_CREDIT_PERMIT"] = 1] = "AAVE_V3_CREDIT_PERMIT";
    PermitIds[PermitIds["ALLOW_CREDIT_PERMIT"] = 2] = "ALLOW_CREDIT_PERMIT";
})(PermitIds || (PermitIds = {}));
export var LenderIds;
(function (LenderIds) {
    LenderIds[LenderIds["UP_TO_AAVE_V3"] = 1000] = "UP_TO_AAVE_V3";
    LenderIds[LenderIds["UP_TO_AAVE_V2"] = 2000] = "UP_TO_AAVE_V2";
    LenderIds[LenderIds["UP_TO_COMPOUND_V3"] = 3000] = "UP_TO_COMPOUND_V3";
    LenderIds[LenderIds["UP_TO_COMPOUND_V2"] = 4000] = "UP_TO_COMPOUND_V2";
    LenderIds[LenderIds["UP_TO_MORPHO"] = 5000] = "UP_TO_MORPHO";
})(LenderIds || (LenderIds = {}));
export var LenderOps;
(function (LenderOps) {
    LenderOps[LenderOps["DEPOSIT"] = 0] = "DEPOSIT";
    LenderOps[LenderOps["BORROW"] = 1] = "BORROW";
    LenderOps[LenderOps["REPAY"] = 2] = "REPAY";
    LenderOps[LenderOps["WITHDRAW"] = 3] = "WITHDRAW";
    LenderOps[LenderOps["DEPOSIT_LENDING_TOKEN"] = 4] = "DEPOSIT_LENDING_TOKEN";
    LenderOps[LenderOps["WITHDRAW_LENDING_TOKEN"] = 5] = "WITHDRAW_LENDING_TOKEN";
})(LenderOps || (LenderOps = {}));
export var FlashLoanIds;
(function (FlashLoanIds) {
    FlashLoanIds[FlashLoanIds["MORPHO"] = 0] = "MORPHO";
    FlashLoanIds[FlashLoanIds["BALANCER_V2"] = 1] = "BALANCER_V2";
    FlashLoanIds[FlashLoanIds["AAVE_V3"] = 2] = "AAVE_V3";
    FlashLoanIds[FlashLoanIds["AAVE_V2"] = 3] = "AAVE_V2";
})(FlashLoanIds || (FlashLoanIds = {}));
export var ERC4646Ids;
(function (ERC4646Ids) {
    ERC4646Ids[ERC4646Ids["DEPOSIT"] = 0] = "DEPOSIT";
    ERC4646Ids[ERC4646Ids["WITHDRAW"] = 1] = "WITHDRAW";
})(ERC4646Ids || (ERC4646Ids = {}));
export var Gen2025ActionIds;
(function (Gen2025ActionIds) {
    Gen2025ActionIds[Gen2025ActionIds["UNLOCK"] = 0] = "UNLOCK";
    Gen2025ActionIds[Gen2025ActionIds["UNI_V4_TAKE"] = 1] = "UNI_V4_TAKE";
    Gen2025ActionIds[Gen2025ActionIds["UNI_V4_SETTLE"] = 2] = "UNI_V4_SETTLE";
    Gen2025ActionIds[Gen2025ActionIds["UNI_V4_SYNC"] = 3] = "UNI_V4_SYNC";
    Gen2025ActionIds[Gen2025ActionIds["BAL_V3_TAKE"] = 4] = "BAL_V3_TAKE";
    Gen2025ActionIds[Gen2025ActionIds["BAL_V3_SETTLE"] = 5] = "BAL_V3_SETTLE";
})(Gen2025ActionIds || (Gen2025ActionIds = {}));
export var ComposerCommands;
(function (ComposerCommands) {
    ComposerCommands[ComposerCommands["SWAPS"] = 32] = "SWAPS";
    ComposerCommands[ComposerCommands["EXT_CALL"] = 64] = "EXT_CALL";
    ComposerCommands[ComposerCommands["LENDING"] = 96] = "LENDING";
    ComposerCommands[ComposerCommands["TRANSFERS"] = 128] = "TRANSFERS";
    ComposerCommands[ComposerCommands["PERMIT"] = 160] = "PERMIT";
    ComposerCommands[ComposerCommands["FLASH_LOAN"] = 192] = "FLASH_LOAN";
    ComposerCommands[ComposerCommands["ERC4646"] = 224] = "ERC4646";
    ComposerCommands[ComposerCommands["GEN_2025_SINGELTONS"] = 225] = "GEN_2025_SINGELTONS";
})(ComposerCommands || (ComposerCommands = {}));
export var ForwarderCommands;
(function (ForwarderCommands) {
    ForwarderCommands[ForwarderCommands["EXT_CALL"] = 64] = "EXT_CALL";
    ForwarderCommands[ForwarderCommands["ASSET_HANDLING"] = 128] = "ASSET_HANDLING";
})(ForwarderCommands || (ForwarderCommands = {}));
export var DexTypeMappings;
(function (DexTypeMappings) {
    DexTypeMappings[DexTypeMappings["UNISWAP_V3_ID"] = 0] = "UNISWAP_V3_ID";
    DexTypeMappings[DexTypeMappings["IZI_ID"] = 1] = "IZI_ID";
    DexTypeMappings[DexTypeMappings["UNISWAP_V4_ID"] = 2] = "UNISWAP_V4_ID";
    DexTypeMappings[DexTypeMappings["BALANCER_V3_ID"] = 4] = "BALANCER_V3_ID";
    DexTypeMappings[DexTypeMappings["BALANCER_V2_ID"] = 3] = "BALANCER_V2_ID";
    DexTypeMappings[DexTypeMappings["UNISWAP_V2_ID"] = 6] = "UNISWAP_V2_ID";
    DexTypeMappings[DexTypeMappings["UNISWAP_V2_FOT_ID"] = 7] = "UNISWAP_V2_FOT_ID";
    DexTypeMappings[DexTypeMappings["CURVE_V1_STANDARD_ID"] = 60] = "CURVE_V1_STANDARD_ID";
    DexTypeMappings[DexTypeMappings["CURVE_FORK_ID"] = 61] = "CURVE_FORK_ID";
    DexTypeMappings[DexTypeMappings["UNISWAP_V2_MAX_ID"] = 150] = "UNISWAP_V2_MAX_ID";
    DexTypeMappings[DexTypeMappings["CURVE_RECEIVED_ID"] = 150] = "CURVE_RECEIVED_ID";
    DexTypeMappings[DexTypeMappings["WOO_FI_ID"] = 155] = "WOO_FI_ID";
    DexTypeMappings[DexTypeMappings["LB_ID"] = 160] = "LB_ID";
    DexTypeMappings[DexTypeMappings["GMX_ID"] = 170] = "GMX_ID";
    DexTypeMappings[DexTypeMappings["KTX_ID"] = 171] = "KTX_ID";
    DexTypeMappings[DexTypeMappings["MAX_GMX_ID"] = 173] = "MAX_GMX_ID";
    DexTypeMappings[DexTypeMappings["DODO_ID"] = 180] = "DODO_ID";
    DexTypeMappings[DexTypeMappings["SYNC_SWAP_ID"] = 190] = "SYNC_SWAP_ID";
    DexTypeMappings[DexTypeMappings["NATIVE_WRAP_ID"] = 254] = "NATIVE_WRAP_ID";
})(DexTypeMappings || (DexTypeMappings = {}));
export var DexForkMappings;
(function (DexForkMappings) {
    DexForkMappings[DexForkMappings["UNISWAP_V3"] = 0] = "UNISWAP_V3";
    DexForkMappings[DexForkMappings["IZI"] = 0] = "IZI";
    DexForkMappings[DexForkMappings["ANY_V3"] = 255] = "ANY_V3";
    DexForkMappings[DexForkMappings["ANY_IZI"] = 255] = "ANY_IZI";
    DexForkMappings[DexForkMappings["UNISWAP_V4"] = 0] = "UNISWAP_V4";
    DexForkMappings[DexForkMappings["BALANCER_V3"] = 0] = "BALANCER_V3";
    DexForkMappings[DexForkMappings["UNISWAP_V2"] = 0] = "UNISWAP_V2";
})(DexForkMappings || (DexForkMappings = {}));
export function encodePermit2TransferFrom(token, receiver, amount) {
    return encodePacked(["uint8", "uint8", "address", "address", "uint128"], [uint8(ComposerCommands.TRANSFERS), uint8(TransferIds.PERMIT2_TRANSFER_FROM), token, receiver, uint128(amount)]);
}
export function encodeNextGenDexUnlock(singleton, id, d) {
    return encodePacked(["uint8", "uint8", "address", "uint16", "uint8", "bytes"], [
        uint8(ComposerCommands.GEN_2025_SINGELTONS),
        uint8(Gen2025ActionIds.UNLOCK),
        singleton,
        uint16(d.length / 2 - 1 + 1),
        uint8(id),
        d,
    ]);
}
export function encodeBalancerV3FlashLoan(singleton, poolId, asset, receiver, amount, flashData) {
    const take = encodeBalancerV3Take(singleton, asset, receiver, amount);
    const settle = encodeNextGenDexSettleBalancer(singleton, asset, amount);
    return encodeNextGenDexUnlock(singleton, poolId, encodeBalancerV3FlashLoanData(take, flashData, settle));
}
export function encodeBalancerV3FlashLoanData(take, flashData, settle) {
    return encodePacked(["bytes", "bytes", "bytes"], [take, flashData, settle]);
}
export function encodeUniswapV4FlashLoan(singleton, poolId, asset, receiver, amount, flashData) {
    const take = encodeUniswapV4Take(singleton, asset, receiver, amount);
    const settle = encodeNextGenDexSettle(singleton, asset === zeroAddress ? amount : 0);
    const sync = encodeUniswapV4Sync(singleton, asset);
    return encodeNextGenDexUnlock(singleton, poolId, encodeUniswapV4FlashLoanData(take, sync, flashData, settle));
}
export function encodeUniswapV4FlashLoanData(take, sync, flashData, settle) {
    return encodePacked(["bytes", "bytes", "bytes", "bytes"], [take, sync, flashData, settle]);
}
export function encodeBalancerV3Take(singleton, asset, receiver, amount) {
    return encodePacked(["uint8", "uint8", "address", "address", "address", "uint128"], [
        uint8(ComposerCommands.GEN_2025_SINGELTONS),
        uint8(Gen2025ActionIds.BAL_V3_TAKE),
        singleton,
        asset,
        receiver,
        uint128(amount),
    ]);
}
export function encodeUniswapV4Sync(singleton, asset) {
    if (asset === zeroAddress)
        return `0x0`;
    return encodePacked(["uint8", "uint8", "address", "address"], [uint8(ComposerCommands.GEN_2025_SINGELTONS), uint8(Gen2025ActionIds.UNI_V4_SYNC), singleton, asset]);
}
export function encodeUniswapV4Take(singleton, asset, receiver, amount) {
    return encodePacked(["uint8", "uint8", "address", "address", "address", "uint128"], [
        uint8(ComposerCommands.GEN_2025_SINGELTONS),
        uint8(Gen2025ActionIds.UNI_V4_TAKE),
        singleton,
        asset,
        receiver,
        uint128(amount),
    ]);
}
export function swapHead(amount, amountOutMin, assetIn) {
    return encodePacked(["uint8", "uint128", "uint128", "address"], [
        uint8(ComposerCommands.SWAPS),
        generateAmountBitmap(uint128(amount), false, false),
        uint128(amountOutMin),
        assetIn,
    ]);
}
export function attachBranch(data, hops, splits, splitsData) {
    if (hops !== 0n && splits !== 0n)
        throw new Error("Invalidbranching");
    if (splitsData.length / 2 - 1 > 0 && splits === 0n)
        throw new Error("Nosplitsbutsplitdataprovided");
    return encodePacked(["bytes", "uint8", "uint8", "bytes"], [data, uint8(hops), uint8(splits), splitsData]);
}
export function encodeUniswapV2StyleSwap(tokenOut, receiver, forkId, pool, feeDenom, cfg, flashCalldata) {
    if (uint256(cfg) < 2 && flashCalldata.length / 2 - 1 > 2)
        throw new Error("Invalidconfigforv2swap");
    return encodePacked(["address", "address", "uint8", "address", "uint16", "uint8", "uint16", "bytes"], [
        tokenOut,
        receiver,
        uint8(DexTypeMappings.UNISWAP_V2_ID),
        pool,
        uint16(feeDenom),
        uint8(forkId),
        uint16(cfg === DexPayConfig.FLASH ? flashCalldata.length / 2 - 1 : uint256(cfg)),
        bytes(cfg === DexPayConfig.FLASH ? flashCalldata : newbytes(0)),
    ]);
}
export function encodeUniswapV4StyleSwap(currentData, tokenOut, receiver, manager, fee, tickSpacing, hooks, hookData, cfg) {
    if (cfg === DexPayConfig.FLASH)
        throw new Error("Invalidconfigforv2swap");
    return encodePacked(["bytes", "address", "address", "uint8", "address", "address", "uint24", "uint24", "uint8", "uint16", "bytes"], [
        currentData,
        tokenOut,
        receiver,
        uint8(DexTypeMappings.UNISWAP_V4_ID),
        hooks,
        manager,
        fee,
        tickSpacing,
        uint8(uint256(cfg)),
        uint16(hookData.length / 2 - 1),
        hookData,
    ]);
}
export function encodeBalancerV2StyleSwap(currentData, tokenOut, receiver, poolId, balancerVault, cfg) {
    if (cfg === DexPayConfig.FLASH)
        throw new Error("Invalidconfigforv2swap");
    return encodePacked(["bytes", "address", "address", "uint8", "bytes32", "address", "uint16"], [
        currentData,
        tokenOut,
        receiver,
        uint8(DexTypeMappings.BALANCER_V2_ID),
        poolId,
        balancerVault,
        uint16(uint256(cfg)),
    ]);
}
export function encodeLbStyleSwap(currentData, tokenOut, receiver, pool, swapForY, cfg) {
    if (cfg === DexPayConfig.FLASH)
        throw new Error("Invalidconfigforv2swap");
    return encodePacked(["bytes", "address", "address", "uint8", "address", "uint8", "uint16"], [
        currentData,
        tokenOut,
        receiver,
        uint8(DexTypeMappings.LB_ID),
        pool,
        uint8(swapForY ? 1 : 0),
        uint16(uint256(cfg)),
    ]);
}
export function encodeSyncSwapStyleSwap(currentData, tokenOut, receiver, pool, cfg) {
    if (cfg === DexPayConfig.FLASH)
        throw new Error("Invalidconfigforv2swap");
    return encodePacked(["bytes", "address", "address", "uint8", "address", "uint16"], [currentData, tokenOut, receiver, uint8(DexTypeMappings.SYNC_SWAP_ID), pool, uint16(uint256(cfg))]);
}
export function encodeUniswapV3StyleSwap(currentData, tokenOut, receiver, forkId, pool, feeTier, cfg, flashCalldata) {
    if (uint256(cfg) < 2 && flashCalldata.length / 2 - 1 > 2)
        throw new Error("Invalidconfigforv2swap");
    return encodePacked(["bytes", "address", "address", "uint8", "address", "uint8", "uint16", "uint16", "bytes"], [
        currentData,
        tokenOut,
        receiver,
        uint8(DexTypeMappings.UNISWAP_V3_ID),
        pool,
        uint8(forkId),
        uint16(feeTier),
        uint16(cfg === DexPayConfig.FLASH ? flashCalldata.length / 2 - 1 : uint256(cfg)),
        bytes(cfg === DexPayConfig.FLASH ? flashCalldata : newbytes(0)),
    ]);
}
export function encodeIzumiStyleSwap(currentData, tokenOut, receiver, forkId, pool, feeTier, cfg, flashCalldata) {
    if (uint256(cfg) < 2 && flashCalldata.length / 2 - 1 > 2)
        throw new Error("Invalidconfigforv2swap");
    return encodePacked(["bytes", "address", "address", "uint8", "address", "uint8", "uint16", "uint16", "bytes"], [
        currentData,
        tokenOut,
        receiver,
        uint8(DexTypeMappings.IZI_ID),
        pool,
        uint8(forkId),
        uint16(feeTier),
        uint16(cfg === DexPayConfig.FLASH ? flashCalldata.length / 2 - 1 : uint256(cfg)),
        bytes(cfg === DexPayConfig.FLASH ? flashCalldata : newbytes(0)),
    ]);
}
export function encodeBalancerV3StyleSwap(currentData, tokenOut, receiver, balancerV3Vault, pool, cfg, poolUserData) {
    return encodePacked(["bytes", "address", "address", "uint8", "address", "address", "uint8", "uint16", "bytes"], [
        currentData,
        tokenOut,
        receiver,
        uint8(DexTypeMappings.BALANCER_V3_ID),
        pool,
        balancerV3Vault,
        uint8(cfg),
        uint16(poolUserData.length / 2 - 1),
        poolUserData,
    ]);
}
export function encodeDodoStyleSwap(currentData, tokenOut, receiver, pool, selector, poolId, cfg, flashCalldata) {
    return encodePacked(["bytes", "address", "address", "uint8", "address", "uint8", "uint16", "uint16", "bytes"], [
        currentData,
        tokenOut,
        receiver,
        uint8(DexTypeMappings.DODO_ID),
        pool,
        uint8(selector),
        uint16(poolId),
        uint16(cfg === DexPayConfig.FLASH ? flashCalldata.length / 2 - 1 : uint256(cfg)),
        bytes(cfg === DexPayConfig.FLASH ? flashCalldata : newbytes(0)),
    ]);
}
export function encodeWooStyleSwap(currentData, tokenOut, receiver, pool, cfg) {
    if (cfg === DexPayConfig.FLASH)
        throw new Error("NoflashforWoo");
    return encodePacked(["bytes", "address", "address", "uint8", "address", "uint8"], [currentData, tokenOut, receiver, uint8(DexTypeMappings.WOO_FI_ID), pool, uint8(uint256(cfg))]);
}
export function encodeGmxStyleSwap(currentData, tokenOut, receiver, pool, cfg) {
    if (cfg === DexPayConfig.FLASH)
        throw new Error("NoflashforWoo");
    return encodePacked(["bytes", "address", "address", "uint8", "address", "uint16"], [currentData, tokenOut, receiver, uint8(DexTypeMappings.GMX_ID), pool, uint16(uint256(cfg))]);
}
export function encodeKtxStyleSwap(currentData, tokenOut, receiver, pool, cfg) {
    if (cfg === DexPayConfig.FLASH)
        throw new Error("NoflashforWoo");
    return encodePacked(["bytes", "address", "address", "uint8", "address", "uint16"], [currentData, tokenOut, receiver, uint8(DexTypeMappings.KTX_ID), pool, uint16(uint256(cfg))]);
}
export function encodeCurveStyleSwap(tokenOut, receiver, pool, indexIn, indexOut, selectorId, cfg) {
    if (cfg === DexPayConfig.FLASH)
        throw new Error("FlashnotyetsupportedforCurve");
    return encodePacked(["address", "address", "uint8", "address", "uint8", "uint8", "uint8", "uint16"], [
        tokenOut,
        receiver,
        uint8(DexTypeMappings.CURVE_V1_STANDARD_ID),
        pool,
        uint8(indexIn),
        uint8(indexOut),
        uint8(selectorId),
        uint16(uint256(cfg)),
    ]);
}
export function encodeCurveNGStyleSwap(tokenOut, receiver, pool, indexIn, indexOut, selectorId, cfg) {
    if (cfg === DexPayConfig.FLASH)
        throw new Error("FlashnotyetsupportedforCurve");
    return encodePacked(["address", "address", "uint8", "address", "uint8", "uint8", "uint8", "uint16"], [
        tokenOut,
        receiver,
        uint8(DexTypeMappings.CURVE_RECEIVED_ID),
        pool,
        uint8(indexIn),
        uint8(indexOut),
        uint8(selectorId),
        uint16(uint256(cfg)),
    ]);
}
export function encodeNextGenDexSettle(singleton, nativeAmount) {
    return encodePacked(["uint8", "uint8", "address", "uint128"], [
        uint8(ComposerCommands.GEN_2025_SINGELTONS),
        uint8(Gen2025ActionIds.UNI_V4_SETTLE),
        singleton,
        uint128(nativeAmount),
    ]);
}
export function encodeNextGenDexSettleBalancer(singleton, asset, amountHint) {
    return encodePacked(["uint8", "uint8", "address", "address", "uint128"], [
        uint8(ComposerCommands.GEN_2025_SINGELTONS),
        uint8(Gen2025ActionIds.BAL_V3_SETTLE),
        singleton,
        asset,
        uint128(amountHint >= 0xffffffffffffffffffffffffffffffn ? 0xffffffffffffffffffffffffffffffn : amountHint),
    ]);
}
export function encodeTransferIn(asset, from, amount) {
    return encodePacked(["uint8", "uint8", "address", "address", "uint128"], [uint8(ComposerCommands.TRANSFERS), uint8(TransferIds.TRANSFER_FROM), asset, from, uint128(amount)]);
}
export function encodeSweep(asset, receiver, amount, sweepType) {
    return encodePacked(["uint8", "uint8", "address", "address", "uint8", "uint128"], [uint8(ComposerCommands.TRANSFERS), uint8(TransferIds.SWEEP), asset, receiver, sweepType, uint128(amount)]);
}
export function encodeWrap(amount, wrapTarget) {
    return encodePacked(["uint8", "uint8", "address", "address", "uint8", "uint128"], [
        uint8(ComposerCommands.TRANSFERS),
        uint8(TransferIds.SWEEP),
        zeroAddress,
        wrapTarget,
        uint8(SweepType.AMOUNT),
        uint128(amount),
    ]);
}
export function encodeApprove(asset, target) {
    return encodePacked(["uint8", "uint8", "address", "address"], [uint8(ComposerCommands.TRANSFERS), uint8(TransferIds.APPROVE), asset, target]);
}
export function encodeUnwrap(target, receiver, amount, sweepType) {
    return encodePacked(["uint8", "uint8", "address", "address", "uint8", "uint128"], [
        uint8(ComposerCommands.TRANSFERS),
        uint8(TransferIds.UNWRAP_WNATIVE),
        target,
        receiver,
        sweepType,
        uint128(amount),
    ]);
}
export function encodeBalancerV2FlashLoan(asset, amount, poolId, data) {
    return encodePacked(["uint8", "uint8", "address", "uint128", "uint16", "bytes"], [
        uint8(ComposerCommands.FLASH_LOAN),
        uint8(FlashLoanIds.BALANCER_V2),
        asset,
        uint128(amount),
        uint16(data.length / 2 - 1 + 1),
        encodeUint8AndBytes(poolId, data),
    ]);
}
export function encodeFlashLoan(asset, amount, pool, poolType, poolId, data) {
    return encodePacked(["bytes", "uint8", "uint8", "address", "address", "uint128", "uint16", "bytes"], [
        encodeApprove(asset, pool),
        uint8(ComposerCommands.FLASH_LOAN),
        poolType,
        asset,
        pool,
        uint128(amount),
        uint16(data.length / 2 - 1 + 1),
        encodeUint8AndBytes(poolId, data),
    ]);
}
export function encodeUint8AndBytes(poolId, data) {
    return encodePacked(["uint8", "bytes"], [uint8(poolId), data]);
}
export function encodeMorphoMarket(loanToken, collateralToken, oracle, irm, lltv) {
    return encodePacked(["address", "address", "address", "address", "uint128"], [loanToken, collateralToken, oracle, irm, uint128(lltv)]);
}
export function encodeMorphoDepositCollateral(market, assets, receiver, data, morphoB, pId) {
    return encodePacked(["bytes", "uint8", "uint8", "uint16", "bytes", "uint128", "address", "address", "uint16", "bytes"], [
        encodeApprove(getMorphoCollateral(market), morphoB),
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.DEPOSIT),
        uint16(LenderIds.UP_TO_MORPHO),
        market,
        uint128(assets),
        receiver,
        morphoB,
        uint16(data.length / 2 - 1 > 0 ? data.length / 2 - 1 + 1 : 0),
        data.length / 2 - 1 === 0 ? newbytes(0) : encodeUint8AndBytes(uint8(pId), data),
    ]);
}
export function encodeMorphoDeposit(market, isShares, assets, receiver, data, morphoB, pId) {
    return encodePacked(["bytes", "uint8", "uint8", "uint16", "bytes", "uint128", "address", "address", "uint16", "bytes"], [
        encodeApprove(getMorphoLoanAsset(market), morphoB),
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.DEPOSIT_LENDING_TOKEN),
        uint16(LenderIds.UP_TO_MORPHO),
        market,
        generateAmountBitmap(uint128(assets), isShares, false),
        receiver,
        morphoB,
        uint16(data.length / 2 - 1 > 0 ? data.length / 2 - 1 + 1 : 0),
        data.length / 2 - 1 === 0 ? newbytes(0) : encodeUint8AndBytes(uint8(pId), data),
    ]);
}
export function encodeErc4646Deposit(asset, vault, isShares, assets, receiver) {
    return encodePacked(["bytes", "uint8", "uint8", "address", "address", "uint128", "address"], [
        encodeApprove(asset, vault),
        uint8(ComposerCommands.ERC4646),
        uint8(0),
        asset,
        vault,
        generateAmountBitmap(uint128(assets), isShares, false),
        receiver,
    ]);
}
export function encodeErc4646Withdraw(vault, isShares, assets, receiver) {
    return encodePacked(["uint8", "uint8", "address", "uint128", "address"], [
        uint8(ComposerCommands.ERC4646),
        uint8(1),
        vault,
        generateAmountBitmap(uint128(assets), isShares, false),
        receiver,
    ]);
}
export function encodeMorphoWithdraw(market, isShares, assets, receiver, morphoB) {
    return encodePacked(["uint8", "uint8", "uint16", "bytes", "uint128", "address", "address"], [
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.WITHDRAW_LENDING_TOKEN),
        uint16(LenderIds.UP_TO_MORPHO),
        market,
        generateAmountBitmap(uint128(assets), isShares, false),
        receiver,
        morphoB,
    ]);
}
export function encodeMorphoWithdrawCollateral(market, assets, receiver, morphoB) {
    return encodePacked(["uint8", "uint8", "uint16", "bytes", "uint128", "address", "address"], [
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.WITHDRAW),
        uint16(LenderIds.UP_TO_MORPHO),
        market,
        uint128(assets),
        receiver,
        morphoB,
    ]);
}
export function encodeMorphoBorrow(market, isShares, assets, receiver, morphoB) {
    return encodePacked(["uint8", "uint8", "uint16", "bytes", "uint128", "address", "address"], [
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.BORROW),
        uint16(LenderIds.UP_TO_MORPHO),
        market,
        generateAmountBitmap(uint128(assets), isShares, false),
        receiver,
        morphoB,
    ]);
}
export function encodeMorphoRepay(market, isShares, unsafe, assets, receiver, data, morphoB, pId) {
    return encodePacked(["bytes", "uint8", "uint8", "uint16", "bytes", "uint128", "address", "address", "uint16", "bytes"], [
        encodeApprove(getMorphoLoanAsset(market), morphoB),
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.REPAY),
        uint16(LenderIds.UP_TO_MORPHO),
        market,
        generateAmountBitmap(uint128(assets), isShares, unsafe),
        receiver,
        morphoB,
        uint16(data.length / 2 - 1 > 0 ? data.length / 2 - 1 + 1 : 0),
        data.length / 2 - 1 === 0 ? newbytes(0) : encodeUint8AndBytes(uint8(pId), data),
    ]);
}
export function encodeAaveDeposit(token, amount, receiver, pool) {
    return encodePacked(["bytes", "uint8", "uint8", "uint16", "address", "uint128", "address", "address"], [
        encodeApprove(token, pool),
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.DEPOSIT),
        uint16(LenderIds.UP_TO_AAVE_V3 - 1),
        token,
        uint128(amount),
        receiver,
        pool,
    ]);
}
export function encodeAaveBorrow(token, amount, receiver, mode, pool) {
    return encodePacked(["uint8", "uint8", "uint16", "address", "uint128", "address", "uint8", "address"], [
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.BORROW),
        uint16(LenderIds.UP_TO_AAVE_V3 - 1),
        token,
        uint128(amount),
        receiver,
        uint8(mode),
        pool,
    ]);
}
export function encodeAaveRepay(token, amount, receiver, mode, dToken, pool) {
    return encodePacked(["bytes", "uint8", "uint8", "uint16", "address", "uint128", "address", "uint8", "address", "address"], [
        encodeApprove(token, pool),
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.REPAY),
        uint16(LenderIds.UP_TO_AAVE_V3 - 1),
        token,
        uint128(amount),
        receiver,
        uint8(mode),
        dToken,
        pool,
    ]);
}
export function encodeAaveWithdraw(token, amount, receiver, aToken, pool) {
    return encodePacked(["uint8", "uint8", "uint16", "address", "uint128", "address", "address", "address"], [
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.WITHDRAW),
        uint16(LenderIds.UP_TO_AAVE_V3 - 1),
        token,
        uint128(amount),
        receiver,
        aToken,
        pool,
    ]);
}
export function encodeAaveV2Deposit(token, amount, receiver, pool) {
    return encodePacked(["bytes", "uint8", "uint8", "uint16", "address", "uint128", "address", "address"], [
        encodeApprove(token, pool),
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.DEPOSIT),
        uint16(LenderIds.UP_TO_AAVE_V2 - 1),
        token,
        uint128(amount),
        receiver,
        pool,
    ]);
}
export function encodeAaveV2Borrow(token, amount, receiver, mode, pool) {
    return encodePacked(["uint8", "uint8", "uint16", "address", "uint128", "address", "uint8", "address"], [
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.BORROW),
        uint16(LenderIds.UP_TO_AAVE_V2 - 1),
        token,
        uint128(amount),
        receiver,
        uint8(mode),
        pool,
    ]);
}
export function encodeAaveV2Repay(token, amount, receiver, mode, dToken, pool) {
    return encodePacked(["bytes", "uint8", "uint8", "uint16", "address", "uint128", "address", "uint8", "address", "address"], [
        encodeApprove(token, pool),
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.REPAY),
        uint16(LenderIds.UP_TO_AAVE_V2 - 1),
        token,
        uint128(amount),
        receiver,
        uint8(mode),
        dToken,
        pool,
    ]);
}
export function encodeAaveV2Withdraw(token, amount, receiver, aToken, pool) {
    return encodePacked(["uint8", "uint8", "uint16", "address", "uint128", "address", "address", "address"], [
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.WITHDRAW),
        uint16(LenderIds.UP_TO_AAVE_V2 - 1),
        token,
        uint128(amount),
        receiver,
        aToken,
        pool,
    ]);
}
export function encodeCompoundV3Deposit(token, amount, receiver, comet) {
    return encodePacked(["bytes", "uint8", "uint8", "uint16", "address", "uint128", "address", "address"], [
        encodeApprove(token, comet),
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.DEPOSIT),
        uint16(LenderIds.UP_TO_COMPOUND_V3 - 1),
        token,
        uint128(amount),
        receiver,
        comet,
    ]);
}
export function encodeCompoundV3Borrow(token, amount, receiver, comet) {
    return encodePacked(["uint8", "uint8", "uint16", "address", "uint128", "address", "address"], [
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.BORROW),
        uint16(LenderIds.UP_TO_COMPOUND_V3 - 1),
        token,
        uint128(amount),
        receiver,
        comet,
    ]);
}
export function encodeCompoundV3Repay(token, amount, receiver, comet) {
    return encodePacked(["bytes", "uint8", "uint8", "uint16", "address", "uint128", "address", "address"], [
        encodeApprove(token, comet),
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.REPAY),
        uint16(LenderIds.UP_TO_COMPOUND_V3 - 1),
        token,
        uint128(amount),
        receiver,
        comet,
    ]);
}
export function encodeCompoundV3Withdraw(token, amount, receiver, comet, isBase) {
    return encodePacked(["uint8", "uint8", "uint16", "address", "uint128", "address", "uint8", "address"], [
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.WITHDRAW),
        uint16(LenderIds.UP_TO_COMPOUND_V3 - 1),
        token,
        uint128(amount),
        receiver,
        isBase ? uint8(1) : uint8(0),
        comet,
    ]);
}
export function encodeCompoundV2Deposit(token, amount, receiver, cToken) {
    return encodePacked(["bytes", "uint8", "uint8", "uint16", "address", "uint128", "address", "address"], [
        token === zeroAddress ? newbytes(0) : encodeApprove(token, cToken),
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.DEPOSIT),
        uint16(LenderIds.UP_TO_COMPOUND_V2 - 1),
        token,
        uint128(amount),
        receiver,
        cToken,
    ]);
}
export function encodeCompoundV2Borrow(token, amount, receiver, cToken) {
    return encodePacked(["uint8", "uint8", "uint16", "address", "uint128", "address", "address"], [
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.BORROW),
        uint16(LenderIds.UP_TO_COMPOUND_V2 - 1),
        token,
        uint128(amount),
        receiver,
        cToken,
    ]);
}
export function encodeCompoundV2Repay(token, amount, receiver, cToken) {
    return encodePacked(["bytes", "uint8", "uint8", "uint16", "address", "uint128", "address", "address"], [
        token === zeroAddress ? newbytes(0) : encodeApprove(token, cToken),
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.REPAY),
        uint16(LenderIds.UP_TO_COMPOUND_V2 - 1),
        token,
        uint128(amount),
        receiver,
        cToken,
    ]);
}
export function encodeCompoundV2Withdraw(token, amount, receiver, cToken) {
    return encodePacked(["uint8", "uint8", "uint16", "address", "uint128", "address", "address"], [
        uint8(ComposerCommands.LENDING),
        uint8(LenderOps.WITHDRAW),
        uint16(LenderIds.UP_TO_COMPOUND_V2 - 1),
        token,
        uint128(amount),
        receiver,
        cToken,
    ]);
}
