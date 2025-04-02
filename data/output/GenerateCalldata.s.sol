
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../input/CalldataLib.sol";

contract GenerateCalldata is Script {
    function setUp() public {}

    function run() public {
        // Test each function with generated inputs

        // Test transferIn
        bytes memory transferInResult = CalldataLib.transferIn(
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000,
            9007199254740991
        );
        console.logBytes(transferInResult); // 0 // Add index for parsing

        // Test sweep
        bytes memory sweepResult = CalldataLib.sweep(
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000,
            9007199254740991,
            CalldataLib.SweepType.VALIDATE
        );
        console.logBytes(sweepResult); // 1 // Add index for parsing

        // Test wrap
        bytes memory wrapResult = CalldataLib.wrap(
            9007199254740991
        );
        console.logBytes(wrapResult); // 2 // Add index for parsing

        // Test unwrap
        bytes memory unwrapResult = CalldataLib.unwrap(
            0x1De17A0000000000000000000000000000000000,
            9007199254740991,
            CalldataLib.SweepType.VALIDATE
        );
        console.logBytes(unwrapResult); // 3 // Add index for parsing

        // Test encodeFlashLoan
        bytes memory encodeFlashLoanResult = CalldataLib.encodeFlashLoan(
            0x1De17A0000000000000000000000000000000000,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            255,
            255,
            "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef"
        );
        console.logBytes(encodeFlashLoanResult); // 4 // Add index for parsing

        // Test morphoDepositCollateral
        bytes memory morphoDepositCollateralResult = CalldataLib.morphoDepositCollateral(
            "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef",
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef",
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(morphoDepositCollateralResult); // 5 // Add index for parsing

        // Test morphoDeposit
        bytes memory morphoDepositResult = CalldataLib.morphoDeposit(
            "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef",
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef",
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(morphoDepositResult); // 6 // Add index for parsing

        // Test erc4646Deposit
        bytes memory erc4646DepositResult = CalldataLib.erc4646Deposit(
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000,
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(erc4646DepositResult); // 7 // Add index for parsing

        // Test erc4646Withdraw
        bytes memory erc4646WithdrawResult = CalldataLib.erc4646Withdraw(
            0x1De17A0000000000000000000000000000000000,
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(erc4646WithdrawResult); // 8 // Add index for parsing

        // Test morphoWithdraw
        bytes memory morphoWithdrawResult = CalldataLib.morphoWithdraw(
            "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef",
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(morphoWithdrawResult); // 9 // Add index for parsing

        // Test morphoWithdrawCollateral
        bytes memory morphoWithdrawCollateralResult = CalldataLib.morphoWithdrawCollateral(
            "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef",
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(morphoWithdrawCollateralResult); // 10 // Add index for parsing

        // Test morphoBorrow
        bytes memory morphoBorrowResult = CalldataLib.morphoBorrow(
            "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef",
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(morphoBorrowResult); // 11 // Add index for parsing

        // Test morphoRepay
        bytes memory morphoRepayResult = CalldataLib.morphoRepay(
            "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef",
            true,
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef",
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(morphoRepayResult); // 12 // Add index for parsing

        // Test encodeAaveDeposit
        bytes memory encodeAaveDepositResult = CalldataLib.encodeAaveDeposit(
            0x1De17A0000000000000000000000000000000000,
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(encodeAaveDepositResult); // 13 // Add index for parsing

        // Test encodeAaveBorrow
        bytes memory encodeAaveBorrowResult = CalldataLib.encodeAaveBorrow(
            0x1De17A0000000000000000000000000000000000,
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(encodeAaveBorrowResult); // 14 // Add index for parsing

        // Test encodeAaveRepay
        bytes memory encodeAaveRepayResult = CalldataLib.encodeAaveRepay(
            0x1De17A0000000000000000000000000000000000,
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(encodeAaveRepayResult); // 15 // Add index for parsing

        // Test encodeAaveWithdraw
        bytes memory encodeAaveWithdrawResult = CalldataLib.encodeAaveWithdraw(
            0x1De17A0000000000000000000000000000000000,
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(encodeAaveWithdrawResult); // 16 // Add index for parsing

        // Test encodeAaveV2Deposit
        bytes memory encodeAaveV2DepositResult = CalldataLib.encodeAaveV2Deposit(
            0x1De17A0000000000000000000000000000000000,
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(encodeAaveV2DepositResult); // 17 // Add index for parsing

        // Test encodeAaveV2Borrow
        bytes memory encodeAaveV2BorrowResult = CalldataLib.encodeAaveV2Borrow(
            0x1De17A0000000000000000000000000000000000,
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(encodeAaveV2BorrowResult); // 18 // Add index for parsing

        // Test encodeAaveV2Repay
        bytes memory encodeAaveV2RepayResult = CalldataLib.encodeAaveV2Repay(
            0x1De17A0000000000000000000000000000000000,
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(encodeAaveV2RepayResult); // 19 // Add index for parsing

        // Test encodeAaveV2Withdraw
        bytes memory encodeAaveV2WithdrawResult = CalldataLib.encodeAaveV2Withdraw(
            0x1De17A0000000000000000000000000000000000,
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(encodeAaveV2WithdrawResult); // 20 // Add index for parsing

        // Test encodeCompoundV3Deposit
        bytes memory encodeCompoundV3DepositResult = CalldataLib.encodeCompoundV3Deposit(
            0x1De17A0000000000000000000000000000000000,
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(encodeCompoundV3DepositResult); // 21 // Add index for parsing

        // Test encodeCompoundV3Borrow
        bytes memory encodeCompoundV3BorrowResult = CalldataLib.encodeCompoundV3Borrow(
            0x1De17A0000000000000000000000000000000000,
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(encodeCompoundV3BorrowResult); // 22 // Add index for parsing

        // Test encodeCompoundV3Repay
        bytes memory encodeCompoundV3RepayResult = CalldataLib.encodeCompoundV3Repay(
            0x1De17A0000000000000000000000000000000000,
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(encodeCompoundV3RepayResult); // 23 // Add index for parsing

        // Test encodeCompoundV3Withdraw
        bytes memory encodeCompoundV3WithdrawResult = CalldataLib.encodeCompoundV3Withdraw(
            0x1De17A0000000000000000000000000000000000,
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000,
            true
        );
        console.logBytes(encodeCompoundV3WithdrawResult); // 24 // Add index for parsing

        // Test encodeCompoundV2Deposit
        bytes memory encodeCompoundV2DepositResult = CalldataLib.encodeCompoundV2Deposit(
            0x1De17A0000000000000000000000000000000000,
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(encodeCompoundV2DepositResult); // 25 // Add index for parsing

        // Test encodeCompoundV2Borrow
        bytes memory encodeCompoundV2BorrowResult = CalldataLib.encodeCompoundV2Borrow(
            0x1De17A0000000000000000000000000000000000,
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(encodeCompoundV2BorrowResult); // 26 // Add index for parsing

        // Test encodeCompoundV2Repay
        bytes memory encodeCompoundV2RepayResult = CalldataLib.encodeCompoundV2Repay(
            0x1De17A0000000000000000000000000000000000,
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(encodeCompoundV2RepayResult); // 27 // Add index for parsing

        // Test encodeCompoundV2Withdraw
        bytes memory encodeCompoundV2WithdrawResult = CalldataLib.encodeCompoundV2Withdraw(
            0x1De17A0000000000000000000000000000000000,
            true,
            9007199254740991,
            0x1De17A0000000000000000000000000000000000,
            0x1De17A0000000000000000000000000000000000
        );
        console.logBytes(encodeCompoundV2WithdrawResult); // 28 // Add index for parsing

    }
}