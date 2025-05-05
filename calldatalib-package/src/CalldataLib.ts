// @ts-nocheck
import { type Hex, type Address, zeroAddress } from "viem";
import {
	encodePacked,
	uint128,
	uint8,
	uint112,
	uint16,
	uint256,
	_PRE_PARAM,
	_SHARES_MASK,
	_UNSAFE_AMOUNT,
	generateAmountBitmap,
	newbytes,
	bytes,
	getMorphoCollateral,
	getMorphoLoanAsset,
} from "./utils";
export enum SweepType {
	VALIDATE = 0,
	AMOUNT = 1,
}

export enum DexPayConfig {
	CALLER_PAYS = 0,
	CONTRACT_PAYS = 1,
	PRE_FUND = 2,
	FLASH = 3,
}

export enum DodoSelector {
	SELL_BASE = 0,
	SELL_QUOTE = 1,
}

export enum TransferIds {
	TRANSFER_FROM = 0,
	SWEEP = 1,
	WRAP_NATIVE = 2,
	UNWRAP_WNATIVE = 3,
	PERMIT2_TRANSFER_FROM = 4,
	APPROVE = 5,
}

export enum PermitIds {
	TOKEN_PERMIT = 0,
	AAVE_V3_CREDIT_PERMIT = 1,
	ALLOW_CREDIT_PERMIT = 2,
}

export enum LenderIds {
	UP_TO_AAVE_V3 = 1000,
	UP_TO_AAVE_V2 = 2000,
	UP_TO_COMPOUND_V3 = 3000,
	UP_TO_COMPOUND_V2 = 4000,
	UP_TO_MORPHO = 5000,
}

export enum LenderOps {
	DEPOSIT = 0,
	BORROW = 1,
	REPAY = 2,
	WITHDRAW = 3,
	DEPOSIT_LENDING_TOKEN = 4,
	WITHDRAW_LENDING_TOKEN = 5,
}

export enum FlashLoanIds {
	MORPHO = 0,
	BALANCER_V2 = 1,
	AAVE_V3 = 2,
	AAVE_V2 = 3,
}

export enum ERC4626Ids {
	DEPOSIT = 0,
	WITHDRAW = 1,
}

export enum Gen2025ActionIds {
	UNLOCK = 0,
	UNI_V4_TAKE = 1,
	UNI_V4_SETTLE = 2,
	UNI_V4_SYNC = 3,
	BAL_V3_TAKE = 4,
	BAL_V3_SETTLE = 5,
}

export enum ComposerCommands {
	SWAPS = 0x20,
	EXT_CALL = 0x40,
	LENDING = 0x60,
	TRANSFERS = 0x80,
	PERMIT = 0xa0,
	FLASH_LOAN = 0xc0,
	ERC4626 = 0xe0,
	GEN_2025_SINGELTONS = 0xe1,
}

export enum DexTypeMappings {
	UNISWAP_V3_ID = 0,
	UNISWAP_V2_ID = 1,
	UNISWAP_V4_ID = 2,
	IZI_ID = 5,
	UNISWAP_V2_FOT_ID = 3,
	CURVE_V1_STANDARD_ID = 64,
	CURVE_RECEIVED_ID = 65,
	CURVE_FORK_ID = 66,
	WOO_FI_ID = 80,
	GMX_ID = 90,
	KTX_ID = 91,
	BALANCER_V2_ID = 128,
	BALANCER_V3_ID = 129,
	LB_ID = 140,
	DODO_ID = 150,
	SYNC_SWAP_ID = 160,
	ERC4626_ID = 253,
	NATIVE_WRAP_ID = 254,
}

export enum DexForkMappings {
	UNISWAP_V3 = 0,
	IZI = 0,
	ANY_V3 = 0xff,
	ANY_IZI = 0xff,
	UNISWAP_V4 = 0,
	BALANCER_V3 = 0,
	UNISWAP_V2 = 0,
}

export function encodePermit2TransferFrom(token: Address, receiver: Address, amount: bigint): Hex {
	return encodePacked(
		["uint8", "uint8", "address", "address", "uint128"],
		[uint8(ComposerCommands.TRANSFERS), uint8(TransferIds.PERMIT2_TRANSFER_FROM), token, receiver, uint128(amount)],
	);
}

export function encodeNextGenDexUnlock(singleton: Address, id: bigint, d: Hex): Hex {
	return encodePacked(
		["uint8", "uint8", "address", "uint16", "uint8", "bytes"],
		[
			uint8(ComposerCommands.GEN_2025_SINGELTONS),
			uint8(Gen2025ActionIds.UNLOCK),
			singleton,
			uint16(d.length / 2 - 1 + 1),
			uint8(id),
			d,
		],
	);
}

export function encodeBalancerV3FlashLoan(
	singleton: Address,
	poolId: bigint,
	asset: Address,
	receiver: Address,
	amount: bigint,
	flashData: Hex,
): Hex {
	const take = encodeBalancerV3Take(singleton, asset, receiver, amount);
	const settle = encodeNextGenDexSettleBalancer(singleton, asset, amount);
	return encodeNextGenDexUnlock(singleton, poolId, encodeBalancerV3FlashLoanData(take, flashData, settle));
}

export function encodeBalancerV3FlashLoanData(take: Hex, flashData: Hex, settle: Hex): Hex {
	return encodePacked(["bytes", "bytes", "bytes"], [take, flashData, settle]);
}

export function encodeUniswapV4FlashLoan(
	singleton: Address,
	poolId: bigint,
	asset: Address,
	receiver: Address,
	amount: bigint,
	flashData: Hex,
): Hex {
	const take = encodeUniswapV4Take(singleton, asset, receiver, amount);
	const settle = encodeNextGenDexSettle(singleton, asset === zeroAddress ? amount : 0);
	const sync = encodeUniswapV4Sync(singleton, asset);
	return encodeNextGenDexUnlock(singleton, poolId, encodeUniswapV4FlashLoanData(take, sync, flashData, settle));
}

export function encodeUniswapV4FlashLoanData(take: Hex, sync: Hex, flashData: Hex, settle: Hex): Hex {
	return encodePacked(["bytes", "bytes", "bytes", "bytes"], [take, sync, flashData, settle]);
}

export function encodeBalancerV3Take(singleton: Address, asset: Address, receiver: Address, amount: bigint): Hex {
	return encodePacked(
		["uint8", "uint8", "address", "address", "address", "uint128"],
		[
			uint8(ComposerCommands.GEN_2025_SINGELTONS),
			uint8(Gen2025ActionIds.BAL_V3_TAKE),
			singleton,
			asset,
			receiver,
			uint128(amount),
		],
	);
}

export function encodeUniswapV4Sync(singleton: Address, asset: Address): Hex {
	if (asset === zeroAddress) return `0x0` as Hex;
	return encodePacked(
		["uint8", "uint8", "address", "address"],
		[uint8(ComposerCommands.GEN_2025_SINGELTONS), uint8(Gen2025ActionIds.UNI_V4_SYNC), singleton, asset],
	);
}

export function encodeUniswapV4Take(singleton: Address, asset: Address, receiver: Address, amount: bigint): Hex {
	return encodePacked(
		["uint8", "uint8", "address", "address", "address", "uint128"],
		[
			uint8(ComposerCommands.GEN_2025_SINGELTONS),
			uint8(Gen2025ActionIds.UNI_V4_TAKE),
			singleton,
			asset,
			receiver,
			uint128(amount),
		],
	);
}

export function swapHead(amount: bigint, amountOutMin: bigint, assetIn: Address): Hex {
	return encodePacked(
		["uint8", "uint128", "uint128", "address"],
		[
			uint8(ComposerCommands.SWAPS),
			generateAmountBitmap(uint128(amount), false, false),
			uint128(amountOutMin),
			assetIn,
		],
	);
}

export function attachBranch(data: Hex, hops: bigint, splits: bigint, splitsData: Hex): Hex {
	if (hops !== 0n && splits !== 0n) throw new Error("Invalidbranching");
	if (splitsData.length / 2 - 1 > 0 && splits === 0n) throw new Error("Nosplitsbutsplitdataprovided");
	return encodePacked(["bytes", "uint8", "uint8", "bytes"], [data, uint8(hops), uint8(splits), splitsData]);
}

export function encodeUniswapV2StyleSwap(
	tokenOut: Address,
	receiver: Address,
	forkId: bigint,
	pool: Address,
	feeDenom: bigint,
	cfg: any,
	flashCalldata: Hex,
): Hex {
	if (uint256(cfg) < 2 && flashCalldata.length / 2 - 1 > 2) throw new Error("Invalidconfigforv2swap");
	return encodePacked(
		["address", "address", "uint8", "address", "uint16", "uint8", "uint16", "bytes"],
		[
			tokenOut,
			receiver,
			uint8(DexTypeMappings.UNISWAP_V2_ID),
			pool,
			uint16(feeDenom),
			uint8(forkId),
			uint16(cfg === DexPayConfig.FLASH ? flashCalldata.length / 2 - 1 : uint256(cfg)),
			bytes(cfg === DexPayConfig.FLASH ? flashCalldata : newbytes(0)),
		],
	);
}

export function encodeUniswapV4StyleSwap(
	currentData: Hex,
	tokenOut: Address,
	receiver: Address,
	manager: Address,
	fee: number,
	tickSpacing: number,
	hooks: Address,
	hookData: Hex,
	cfg: any,
): Hex {
	if (cfg === DexPayConfig.FLASH) throw new Error("Invalidconfigforv2swap");
	return encodePacked(
		["bytes", "address", "address", "uint8", "address", "address", "uint24", "uint24", "uint8", "uint16", "bytes"],
		[
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
		],
	);
}

export function encodeBalancerV2StyleSwap(
	currentData: Hex,
	tokenOut: Address,
	receiver: Address,
	poolId: Hex,
	balancerVault: Address,
	cfg: any,
): Hex {
	if (cfg === DexPayConfig.FLASH) throw new Error("Invalidconfigforv2swap");
	return encodePacked(
		["bytes", "address", "address", "uint8", "bytes32", "address", "uint16"],
		[
			currentData,
			tokenOut,
			receiver,
			uint8(DexTypeMappings.BALANCER_V2_ID),
			poolId,
			balancerVault,
			uint16(uint256(cfg)),
		],
	);
}

export function encodeLbStyleSwap(
	currentData: Hex,
	tokenOut: Address,
	receiver: Address,
	pool: Address,
	swapForY: boolean,
	cfg: any,
): Hex {
	if (cfg === DexPayConfig.FLASH) throw new Error("Invalidconfigforv2swap");
	return encodePacked(
		["bytes", "address", "address", "uint8", "address", "uint8", "uint16"],
		[
			currentData,
			tokenOut,
			receiver,
			uint8(DexTypeMappings.LB_ID),
			pool,
			uint8(swapForY ? 1 : 0),
			uint16(uint256(cfg)),
		],
	);
}

export function encodeSyncSwapStyleSwap(
	currentData: Hex,
	tokenOut: Address,
	receiver: Address,
	pool: Address,
	cfg: any,
): Hex {
	if (cfg === DexPayConfig.FLASH) throw new Error("Invalidconfigforv2swap");
	return encodePacked(
		["bytes", "address", "address", "uint8", "address", "uint16"],
		[currentData, tokenOut, receiver, uint8(DexTypeMappings.SYNC_SWAP_ID), pool, uint16(uint256(cfg))],
	);
}

export function encodeUniswapV3StyleSwap(
	currentData: Hex,
	tokenOut: Address,
	receiver: Address,
	forkId: bigint,
	pool: Address,
	feeTier: bigint,
	cfg: any,
	flashCalldata: Hex,
): Hex {
	if (uint256(cfg) < 2 && flashCalldata.length / 2 - 1 > 2) throw new Error("Invalidconfigforv2swap");
	return encodePacked(
		["bytes", "address", "address", "uint8", "address", "uint8", "uint16", "uint16", "bytes"],
		[
			currentData,
			tokenOut,
			receiver,
			uint8(DexTypeMappings.UNISWAP_V3_ID),
			pool,
			uint8(forkId),
			uint16(feeTier),
			uint16(cfg === DexPayConfig.FLASH ? flashCalldata.length / 2 - 1 : uint256(cfg)),
			bytes(cfg === DexPayConfig.FLASH ? flashCalldata : newbytes(0)),
		],
	);
}

export function encodeIzumiStyleSwap(
	currentData: Hex,
	tokenOut: Address,
	receiver: Address,
	forkId: bigint,
	pool: Address,
	feeTier: bigint,
	cfg: any,
	flashCalldata: Hex,
): Hex {
	if (uint256(cfg) < 2 && flashCalldata.length / 2 - 1 > 2) throw new Error("Invalidconfigforv2swap");
	return encodePacked(
		["bytes", "address", "address", "uint8", "address", "uint8", "uint16", "uint16", "bytes"],
		[
			currentData,
			tokenOut,
			receiver,
			uint8(DexTypeMappings.IZI_ID),
			pool,
			uint8(forkId),
			uint16(feeTier),
			uint16(cfg === DexPayConfig.FLASH ? flashCalldata.length / 2 - 1 : uint256(cfg)),
			bytes(cfg === DexPayConfig.FLASH ? flashCalldata : newbytes(0)),
		],
	);
}

export function encodeBalancerV3StyleSwap(
	currentData: Hex,
	tokenOut: Address,
	receiver: Address,
	balancerV3Vault: Address,
	pool: Address,
	cfg: any,
	poolUserData: Hex,
): Hex {
	return encodePacked(
		["bytes", "address", "address", "uint8", "address", "address", "uint8", "uint16", "bytes"],
		[
			currentData,
			tokenOut,
			receiver,
			uint8(DexTypeMappings.BALANCER_V3_ID),
			pool,
			balancerV3Vault,
			uint8(cfg),
			uint16(poolUserData.length / 2 - 1),
			poolUserData,
		],
	);
}

export function encodeDodoStyleSwap(
	currentData: Hex,
	tokenOut: Address,
	receiver: Address,
	pool: Address,
	selector: any,
	poolId: bigint,
	cfg: any,
	flashCalldata: Hex,
): Hex {
	return encodePacked(
		["bytes", "address", "address", "uint8", "address", "uint8", "uint16", "uint16", "bytes"],
		[
			currentData,
			tokenOut,
			receiver,
			uint8(DexTypeMappings.DODO_ID),
			pool,
			uint8(selector),
			uint16(poolId),
			uint16(cfg === DexPayConfig.FLASH ? flashCalldata.length / 2 - 1 : uint256(cfg)),
			bytes(cfg === DexPayConfig.FLASH ? flashCalldata : newbytes(0)),
		],
	);
}

export function encodeWooStyleSwap(
	currentData: Hex,
	tokenOut: Address,
	receiver: Address,
	pool: Address,
	cfg: any,
): Hex {
	if (cfg === DexPayConfig.FLASH) throw new Error("NoflashforWoo");
	return encodePacked(
		["bytes", "address", "address", "uint8", "address", "uint8"],
		[currentData, tokenOut, receiver, uint8(DexTypeMappings.WOO_FI_ID), pool, uint8(uint256(cfg))],
	);
}

export function encodeGmxStyleSwap(
	currentData: Hex,
	tokenOut: Address,
	receiver: Address,
	pool: Address,
	cfg: any,
): Hex {
	if (cfg === DexPayConfig.FLASH) throw new Error("NoflashforWoo");
	return encodePacked(
		["bytes", "address", "address", "uint8", "address", "uint16"],
		[currentData, tokenOut, receiver, uint8(DexTypeMappings.GMX_ID), pool, uint16(uint256(cfg))],
	);
}

export function encodeKtxStyleSwap(
	currentData: Hex,
	tokenOut: Address,
	receiver: Address,
	pool: Address,
	cfg: any,
): Hex {
	if (cfg === DexPayConfig.FLASH) throw new Error("NoflashforWoo");
	return encodePacked(
		["bytes", "address", "address", "uint8", "address", "uint16"],
		[currentData, tokenOut, receiver, uint8(DexTypeMappings.KTX_ID), pool, uint16(uint256(cfg))],
	);
}

export function encodeCurveStyleSwap(
	tokenOut: Address,
	receiver: Address,
	pool: Address,
	indexIn: bigint,
	indexOut: bigint,
	selectorId: bigint,
	cfg: any,
): Hex {
	if (cfg === DexPayConfig.FLASH) throw new Error("FlashnotyetsupportedforCurve");
	return encodePacked(
		["address", "address", "uint8", "address", "uint8", "uint8", "uint8", "uint16"],
		[
			tokenOut,
			receiver,
			uint8(DexTypeMappings.CURVE_V1_STANDARD_ID),
			pool,
			uint8(indexIn),
			uint8(indexOut),
			uint8(selectorId),
			uint16(uint256(cfg)),
		],
	);
}

export function encodeCurveNGStyleSwap(
	tokenOut: Address,
	receiver: Address,
	pool: Address,
	indexIn: bigint,
	indexOut: bigint,
	selectorId: bigint,
	cfg: any,
): Hex {
	if (cfg === DexPayConfig.FLASH) throw new Error("FlashnotyetsupportedforCurve");
	return encodePacked(
		["address", "address", "uint8", "address", "uint8", "uint8", "uint8", "uint16"],
		[
			tokenOut,
			receiver,
			uint8(DexTypeMappings.CURVE_RECEIVED_ID),
			pool,
			uint8(indexIn),
			uint8(indexOut),
			uint8(selectorId),
			uint16(uint256(cfg)),
		],
	);
}

export function encodeNextGenDexSettle(singleton: Address, nativeAmount: bigint): Hex {
	return encodePacked(
		["uint8", "uint8", "address", "uint128"],
		[
			uint8(ComposerCommands.GEN_2025_SINGELTONS),
			uint8(Gen2025ActionIds.UNI_V4_SETTLE),
			singleton,
			uint128(nativeAmount),
		],
	);
}

export function encodeNextGenDexSettleBalancer(singleton: Address, asset: Address, amountHint: bigint): Hex {
	return encodePacked(
		["uint8", "uint8", "address", "address", "uint128"],
		[
			uint8(ComposerCommands.GEN_2025_SINGELTONS),
			uint8(Gen2025ActionIds.BAL_V3_SETTLE),
			singleton,
			asset,
			uint128(amountHint >= 0xffffffffffffffffffffffffffffffn ? 0xffffffffffffffffffffffffffffffn : amountHint),
		],
	);
}

export function encodeTransferIn(asset: Address, receiver: Address, amount: bigint): Hex {
	return encodePacked(
		["uint8", "uint8", "address", "address", "uint128"],
		[uint8(ComposerCommands.TRANSFERS), uint8(TransferIds.TRANSFER_FROM), asset, receiver, uint128(amount)],
	);
}

export function encodeSweep(asset: Address, receiver: Address, amount: bigint, sweepType: any): Hex {
	return encodePacked(
		["uint8", "uint8", "address", "address", "uint8", "uint128"],
		[uint8(ComposerCommands.TRANSFERS), uint8(TransferIds.SWEEP), asset, receiver, sweepType, uint128(amount)],
	);
}

export function encodeWrap(amount: bigint, wrapTarget: Address): Hex {
	return encodePacked(
		["uint8", "uint8", "address", "address", "uint8", "uint128"],
		[
			uint8(ComposerCommands.TRANSFERS),
			uint8(TransferIds.SWEEP),
			zeroAddress,
			wrapTarget,
			uint8(SweepType.AMOUNT),
			uint128(amount),
		],
	);
}

export function encodeApprove(asset: Address, target: Address): Hex {
	return encodePacked(
		["uint8", "uint8", "address", "address"],
		[uint8(ComposerCommands.TRANSFERS), uint8(TransferIds.APPROVE), asset, target],
	);
}

export function encodeUnwrap(target: Address, receiver: Address, amount: bigint, sweepType: any): Hex {
	return encodePacked(
		["uint8", "uint8", "address", "address", "uint8", "uint128"],
		[
			uint8(ComposerCommands.TRANSFERS),
			uint8(TransferIds.UNWRAP_WNATIVE),
			target,
			receiver,
			sweepType,
			uint128(amount),
		],
	);
}

export function encodeBalancerV2FlashLoan(asset: Address, amount: bigint, poolId: number, data: Hex): Hex {
	return encodePacked(
		["uint8", "uint8", "address", "uint128", "uint16", "bytes"],
		[
			uint8(ComposerCommands.FLASH_LOAN),
			uint8(FlashLoanIds.BALANCER_V2),
			asset,
			uint128(amount),
			uint16(data.length / 2 - 1 + 1),
			encodeUint8AndBytes(poolId, data),
		],
	);
}

export function encodeFlashLoan(
	asset: Address,
	amount: bigint,
	pool: Address,
	poolType: number,
	poolId: number,
	data: Hex,
): Hex {
	return encodePacked(
		["bytes", "uint8", "uint8", "address", "address", "uint128", "uint16", "bytes"],
		[
			encodeApprove(asset, pool),
			uint8(ComposerCommands.FLASH_LOAN),
			poolType,
			asset,
			pool,
			uint128(amount),
			uint16(data.length / 2 - 1 + 1),
			encodeUint8AndBytes(poolId, data),
		],
	);
}

export function encodeUint8AndBytes(poolId: number, data: Hex): Hex {
	return encodePacked(["uint8", "bytes"], [uint8(poolId), data]);
}

export function encodeMorphoMarket(
	loanToken: Address,
	collateralToken: Address,
	oracle: Address,
	irm: Address,
	lltv: bigint,
): Hex {
	return encodePacked(
		["address", "address", "address", "address", "uint128"],
		[loanToken, collateralToken, oracle, irm, uint128(lltv)],
	);
}

export function encodeMorphoDepositCollateral(
	market: Hex,
	assets: bigint,
	receiver: Address,
	data: Hex,
	morphoB: Address,
	pId: bigint,
): Hex {
	return encodePacked(
		["bytes", "uint8", "uint8", "uint16", "bytes", "uint128", "address", "address", "uint16", "bytes"],
		[
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
		],
	);
}

export function encodeMorphoDeposit(
	market: Hex,
	isShares: boolean,
	assets: bigint,
	receiver: Address,
	data: Hex,
	morphoB: Address,
	pId: bigint,
): Hex {
	return encodePacked(
		["bytes", "uint8", "uint8", "uint16", "bytes", "uint128", "address", "address", "uint16", "bytes"],
		[
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
		],
	);
}

export function encodeErc4646Deposit(
	asset: Address,
	vault: Address,
	isShares: boolean,
	assets: bigint,
	receiver: Address,
): Hex {
	return encodePacked(
		["bytes", "uint8", "uint8", "address", "address", "uint128", "address"],
		[
			encodeApprove(asset, vault),
			uint8(ComposerCommands.ERC4626),
			uint8(0),
			asset,
			vault,
			generateAmountBitmap(uint128(assets), isShares, false),
			receiver,
		],
	);
}

export function encodeErc4646Withdraw(vault: Address, isShares: boolean, assets: bigint, receiver: Address): Hex {
	return encodePacked(
		["uint8", "uint8", "address", "uint128", "address"],
		[
			uint8(ComposerCommands.ERC4626),
			uint8(1),
			vault,
			generateAmountBitmap(uint128(assets), isShares, false),
			receiver,
		],
	);
}

export function encodeMorphoWithdraw(
	market: Hex,
	isShares: boolean,
	assets: bigint,
	receiver: Address,
	morphoB: Address,
): Hex {
	return encodePacked(
		["uint8", "uint8", "uint16", "bytes", "uint128", "address", "address"],
		[
			uint8(ComposerCommands.LENDING),
			uint8(LenderOps.WITHDRAW_LENDING_TOKEN),
			uint16(LenderIds.UP_TO_MORPHO),
			market,
			generateAmountBitmap(uint128(assets), isShares, false),
			receiver,
			morphoB,
		],
	);
}

export function encodeMorphoWithdrawCollateral(market: Hex, assets: bigint, receiver: Address, morphoB: Address): Hex {
	return encodePacked(
		["uint8", "uint8", "uint16", "bytes", "uint128", "address", "address"],
		[
			uint8(ComposerCommands.LENDING),
			uint8(LenderOps.WITHDRAW),
			uint16(LenderIds.UP_TO_MORPHO),
			market,
			uint128(assets),
			receiver,
			morphoB,
		],
	);
}

export function encodeMorphoBorrow(
	market: Hex,
	isShares: boolean,
	assets: bigint,
	receiver: Address,
	morphoB: Address,
): Hex {
	return encodePacked(
		["uint8", "uint8", "uint16", "bytes", "uint128", "address", "address"],
		[
			uint8(ComposerCommands.LENDING),
			uint8(LenderOps.BORROW),
			uint16(LenderIds.UP_TO_MORPHO),
			market,
			generateAmountBitmap(uint128(assets), isShares, false),
			receiver,
			morphoB,
		],
	);
}

export function encodeMorphoRepay(
	market: Hex,
	isShares: boolean,
	unsafe: boolean,
	assets: bigint,
	receiver: Address,
	data: Hex,
	morphoB: Address,
	pId: bigint,
): Hex {
	return encodePacked(
		["bytes", "uint8", "uint8", "uint16", "bytes", "uint128", "address", "address", "uint16", "bytes"],
		[
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
		],
	);
}

export function encodeAaveDeposit(token: Address, amount: bigint, receiver: Address, pool: Address): Hex {
	return encodePacked(
		["bytes", "uint8", "uint8", "uint16", "address", "uint128", "address", "address"],
		[
			encodeApprove(token, pool),
			uint8(ComposerCommands.LENDING),
			uint8(LenderOps.DEPOSIT),
			uint16(LenderIds.UP_TO_AAVE_V3 - 1),
			token,
			uint128(amount),
			receiver,
			pool,
		],
	);
}

export function encodeAaveBorrow(token: Address, amount: bigint, receiver: Address, mode: bigint, pool: Address): Hex {
	return encodePacked(
		["uint8", "uint8", "uint16", "address", "uint128", "address", "uint8", "address"],
		[
			uint8(ComposerCommands.LENDING),
			uint8(LenderOps.BORROW),
			uint16(LenderIds.UP_TO_AAVE_V3 - 1),
			token,
			uint128(amount),
			receiver,
			uint8(mode),
			pool,
		],
	);
}

export function encodeAaveRepay(
	token: Address,
	amount: bigint,
	receiver: Address,
	mode: bigint,
	dToken: Address,
	pool: Address,
): Hex {
	return encodePacked(
		["bytes", "uint8", "uint8", "uint16", "address", "uint128", "address", "uint8", "address", "address"],
		[
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
		],
	);
}

export function encodeAaveWithdraw(
	token: Address,
	amount: bigint,
	receiver: Address,
	aToken: Address,
	pool: Address,
): Hex {
	return encodePacked(
		["uint8", "uint8", "uint16", "address", "uint128", "address", "address", "address"],
		[
			uint8(ComposerCommands.LENDING),
			uint8(LenderOps.WITHDRAW),
			uint16(LenderIds.UP_TO_AAVE_V3 - 1),
			token,
			uint128(amount),
			receiver,
			aToken,
			pool,
		],
	);
}

export function encodeAaveV2Deposit(token: Address, amount: bigint, receiver: Address, pool: Address): Hex {
	return encodePacked(
		["bytes", "uint8", "uint8", "uint16", "address", "uint128", "address", "address"],
		[
			encodeApprove(token, pool),
			uint8(ComposerCommands.LENDING),
			uint8(LenderOps.DEPOSIT),
			uint16(LenderIds.UP_TO_AAVE_V2 - 1),
			token,
			uint128(amount),
			receiver,
			pool,
		],
	);
}

export function encodeAaveV2Borrow(
	token: Address,
	amount: bigint,
	receiver: Address,
	mode: bigint,
	pool: Address,
): Hex {
	return encodePacked(
		["uint8", "uint8", "uint16", "address", "uint128", "address", "uint8", "address"],
		[
			uint8(ComposerCommands.LENDING),
			uint8(LenderOps.BORROW),
			uint16(LenderIds.UP_TO_AAVE_V2 - 1),
			token,
			uint128(amount),
			receiver,
			uint8(mode),
			pool,
		],
	);
}

export function encodeAaveV2Repay(
	token: Address,
	amount: bigint,
	receiver: Address,
	mode: bigint,
	dToken: Address,
	pool: Address,
): Hex {
	return encodePacked(
		["bytes", "uint8", "uint8", "uint16", "address", "uint128", "address", "uint8", "address", "address"],
		[
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
		],
	);
}

export function encodeAaveV2Withdraw(
	token: Address,
	amount: bigint,
	receiver: Address,
	aToken: Address,
	pool: Address,
): Hex {
	return encodePacked(
		["uint8", "uint8", "uint16", "address", "uint128", "address", "address", "address"],
		[
			uint8(ComposerCommands.LENDING),
			uint8(LenderOps.WITHDRAW),
			uint16(LenderIds.UP_TO_AAVE_V2 - 1),
			token,
			uint128(amount),
			receiver,
			aToken,
			pool,
		],
	);
}

export function encodeCompoundV3Deposit(token: Address, amount: bigint, receiver: Address, comet: Address): Hex {
	return encodePacked(
		["bytes", "uint8", "uint8", "uint16", "address", "uint128", "address", "address"],
		[
			encodeApprove(token, comet),
			uint8(ComposerCommands.LENDING),
			uint8(LenderOps.DEPOSIT),
			uint16(LenderIds.UP_TO_COMPOUND_V3 - 1),
			token,
			uint128(amount),
			receiver,
			comet,
		],
	);
}

export function encodeCompoundV3Borrow(token: Address, amount: bigint, receiver: Address, comet: Address): Hex {
	return encodePacked(
		["uint8", "uint8", "uint16", "address", "uint128", "address", "address"],
		[
			uint8(ComposerCommands.LENDING),
			uint8(LenderOps.BORROW),
			uint16(LenderIds.UP_TO_COMPOUND_V3 - 1),
			token,
			uint128(amount),
			receiver,
			comet,
		],
	);
}

export function encodeCompoundV3Repay(token: Address, amount: bigint, receiver: Address, comet: Address): Hex {
	return encodePacked(
		["bytes", "uint8", "uint8", "uint16", "address", "uint128", "address", "address"],
		[
			encodeApprove(token, comet),
			uint8(ComposerCommands.LENDING),
			uint8(LenderOps.REPAY),
			uint16(LenderIds.UP_TO_COMPOUND_V3 - 1),
			token,
			uint128(amount),
			receiver,
			comet,
		],
	);
}

export function encodeCompoundV3Withdraw(
	token: Address,
	amount: bigint,
	receiver: Address,
	comet: Address,
	isBase: boolean,
): Hex {
	return encodePacked(
		["uint8", "uint8", "uint16", "address", "uint128", "address", "uint8", "address"],
		[
			uint8(ComposerCommands.LENDING),
			uint8(LenderOps.WITHDRAW),
			uint16(LenderIds.UP_TO_COMPOUND_V3 - 1),
			token,
			uint128(amount),
			receiver,
			isBase ? uint8(1) : uint8(0),
			comet,
		],
	);
}

export function encodeCompoundV2Deposit(token: Address, amount: bigint, receiver: Address, cToken: Address): Hex {
	return encodePacked(
		["bytes", "uint8", "uint8", "uint16", "address", "uint128", "address", "address"],
		[
			token === zeroAddress ? newbytes(0) : encodeApprove(token, cToken),
			uint8(ComposerCommands.LENDING),
			uint8(LenderOps.DEPOSIT),
			uint16(LenderIds.UP_TO_COMPOUND_V2 - 1),
			token,
			uint128(amount),
			receiver,
			cToken,
		],
	);
}

export function encodeCompoundV2Borrow(token: Address, amount: bigint, receiver: Address, cToken: Address): Hex {
	return encodePacked(
		["uint8", "uint8", "uint16", "address", "uint128", "address", "address"],
		[
			uint8(ComposerCommands.LENDING),
			uint8(LenderOps.BORROW),
			uint16(LenderIds.UP_TO_COMPOUND_V2 - 1),
			token,
			uint128(amount),
			receiver,
			cToken,
		],
	);
}

export function encodeCompoundV2Repay(token: Address, amount: bigint, receiver: Address, cToken: Address): Hex {
	return encodePacked(
		["bytes", "uint8", "uint8", "uint16", "address", "uint128", "address", "address"],
		[
			token === zeroAddress ? newbytes(0) : encodeApprove(token, cToken),
			uint8(ComposerCommands.LENDING),
			uint8(LenderOps.REPAY),
			uint16(LenderIds.UP_TO_COMPOUND_V2 - 1),
			token,
			uint128(amount),
			receiver,
			cToken,
		],
	);
}

export function encodeCompoundV2Withdraw(token: Address, amount: bigint, receiver: Address, cToken: Address): Hex {
	return encodePacked(
		["uint8", "uint8", "uint16", "address", "uint128", "address", "address"],
		[
			uint8(ComposerCommands.LENDING),
			uint8(LenderOps.WITHDRAW),
			uint16(LenderIds.UP_TO_COMPOUND_V2 - 1),
			token,
			uint128(amount),
			receiver,
			cToken,
		],
	);
}
