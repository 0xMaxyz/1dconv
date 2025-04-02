
import { describe, expect, test } from 'bun:test';
import * as CalldataLib from "./CalldataLib";
import { SweepType } from './CalldataLib';
import type { Address, Hex } from 'viem';


describe('CalldataLib', () => {

  test('transferIn should match Solidity output', () => {
    
      const result = CalldataLib.transferIn(
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address,
        9007199254740991n
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x80001de17a00000000000000000000000000000000001de17a0000000000000000000000000000000000000000000000001fffffffffffff");
  });

  test('sweep should match Solidity output', () => {
    
      const result = CalldataLib.sweep(
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address,
        9007199254740991n,
        0
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x80011de17a00000000000000000000000000000000001de17a000000000000000000000000000000000000000000000000001fffffffffffff");
  });

  test('wrap should match Solidity output', () => {
    
      const result = CalldataLib.wrap(
        9007199254740991n
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x8002000000000000001fffffffffffff");
  });

  test('unwrap should match Solidity output', () => {
    
      const result = CalldataLib.unwrap(
        "0x1De17A0000000000000000000000000000000000" as Address,
        9007199254740991n,
        0
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x80031de17a000000000000000000000000000000000000000000000000001fffffffffffff");
  });

  test('encodeFlashLoan should match Solidity output', () => {
    
      const result = CalldataLib.encodeFlashLoan(
        "0x1De17A0000000000000000000000000000000000" as Address,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        255n,
        255n,
        "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef" as Hex
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0xc0ffff1de17a00000000000000000000000000000000001de17a0000000000000000000000000000000000000000000000001fffffffffffff00623078316465313761303030303030303031323334353637383930616263646566303030316465313761303030303030303031323334353637383930616263646566303030316465313761303030303030303031323334353637383930616263646566");
  });

  test('morphoDepositCollateral should match Solidity output', () => {
    
      const result = CalldataLib.morphoDepositCollateral(
        "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef" as Hex,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef" as Hex,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x6000138830783164653137613030303030303030313233343536373839306162636465663030303164653137613030303030303030313233343536373839306162636465663030303164653137613030303030303030313233343536373839306162636465660000000000000000001fffffffffffff1de17a00000000000000000000000000000000001de17a000000000000000000000000000000000000623078316465313761303030303030303031323334353637383930616263646566303030316465313761303030303030303031323334353637383930616263646566303030316465313761303030303030303031323334353637383930616263646566");
  });

  test('morphoDeposit should match Solidity output', () => {
    
      const result = CalldataLib.morphoDeposit(
        "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef" as Hex,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef" as Hex,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x6004138830783164653137613030303030303030313233343536373839306162636465663030303164653137613030303030303030313233343536373839306162636465663030303164653137613030303030303030313233343536373839306162636465664000000000000000001fffffffffffff1de17a00000000000000000000000000000000001de17a000000000000000000000000000000000000623078316465313761303030303030303031323334353637383930616263646566303030316465313761303030303030303031323334353637383930616263646566303030316465313761303030303030303031323334353637383930616263646566");
  });

  test('erc4646Deposit should match Solidity output', () => {
    
      const result = CalldataLib.erc4646Deposit(
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0xe0001de17a00000000000000000000000000000000001de17a00000000000000000000000000000000004000000000000000001fffffffffffff1de17a0000000000000000000000000000000000");
  });

  test('erc4646Withdraw should match Solidity output', () => {
    
      const result = CalldataLib.erc4646Withdraw(
        "0x1De17A0000000000000000000000000000000000" as Address,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0xe0011de17a00000000000000000000000000000000004000000000000000001fffffffffffff1de17a0000000000000000000000000000000000");
  });

  test('morphoWithdraw should match Solidity output', () => {
    
      const result = CalldataLib.morphoWithdraw(
        "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef" as Hex,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x6005138830783164653137613030303030303030313233343536373839306162636465663030303164653137613030303030303030313233343536373839306162636465663030303164653137613030303030303030313233343536373839306162636465664000000000000000001fffffffffffff1de17a00000000000000000000000000000000001de17a0000000000000000000000000000000000");
  });

  test('morphoWithdrawCollateral should match Solidity output', () => {
    
      const result = CalldataLib.morphoWithdrawCollateral(
        "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef" as Hex,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x6003138830783164653137613030303030303030313233343536373839306162636465663030303164653137613030303030303030313233343536373839306162636465663030303164653137613030303030303030313233343536373839306162636465660000000000000000001fffffffffffff1de17a00000000000000000000000000000000001de17a0000000000000000000000000000000000");
  });

  test('morphoBorrow should match Solidity output', () => {
    
      const result = CalldataLib.morphoBorrow(
        "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef" as Hex,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x6001138830783164653137613030303030303030313233343536373839306162636465663030303164653137613030303030303030313233343536373839306162636465663030303164653137613030303030303030313233343536373839306162636465664000000000000000001fffffffffffff1de17a00000000000000000000000000000000001de17a0000000000000000000000000000000000");
  });

  test('morphoRepay should match Solidity output', () => {
    
      const result = CalldataLib.morphoRepay(
        "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef" as Hex,
        true,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1de17a000000001234567890abcdef0001de17a000000001234567890abcdef0001de17a000000001234567890abcdef" as Hex,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x6002138830783164653137613030303030303030313233343536373839306162636465663030303164653137613030303030303030313233343536373839306162636465663030303164653137613030303030303030313233343536373839306162636465666000000000000000001fffffffffffff1de17a00000000000000000000000000000000001de17a000000000000000000000000000000000000623078316465313761303030303030303031323334353637383930616263646566303030316465313761303030303030303031323334353637383930616263646566303030316465313761303030303030303031323334353637383930616263646566");
  });

  test('encodeAaveDeposit should match Solidity output', () => {
    
      const result = CalldataLib.encodeAaveDeposit(
        "0x1De17A0000000000000000000000000000000000" as Address,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x600003e71de17a00000000000000000000000000000000008000000000000000001fffffffffffff1de17a00000000000000000000000000000000001de17a0000000000000000000000000000000000");
  });

  test('encodeAaveBorrow should match Solidity output', () => {
    
      const result = CalldataLib.encodeAaveBorrow(
        "0x1De17A0000000000000000000000000000000000" as Address,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x600103e71de17a00000000000000000000000000000000008000000000000000001fffffffffffff1de17a0000000000000000000000000000000000ff1de17a0000000000000000000000000000000000");
  });

  test('encodeAaveRepay should match Solidity output', () => {
    
      const result = CalldataLib.encodeAaveRepay(
        "0x1De17A0000000000000000000000000000000000" as Address,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x600203e71de17a00000000000000000000000000000000008000000000000000001fffffffffffff1de17a0000000000000000000000000000000000ff1de17a00000000000000000000000000000000001de17a0000000000000000000000000000000000");
  });

  test('encodeAaveWithdraw should match Solidity output', () => {
    
      const result = CalldataLib.encodeAaveWithdraw(
        "0x1De17A0000000000000000000000000000000000" as Address,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x600303e71de17a00000000000000000000000000000000008000000000000000001fffffffffffff1de17a00000000000000000000000000000000001de17a00000000000000000000000000000000001de17a0000000000000000000000000000000000");
  });

  test('encodeAaveV2Deposit should match Solidity output', () => {
    
      const result = CalldataLib.encodeAaveV2Deposit(
        "0x1De17A0000000000000000000000000000000000" as Address,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x600007cf1de17a00000000000000000000000000000000008000000000000000001fffffffffffff1de17a00000000000000000000000000000000001de17a0000000000000000000000000000000000");
  });

  test('encodeAaveV2Borrow should match Solidity output', () => {
    
      const result = CalldataLib.encodeAaveV2Borrow(
        "0x1De17A0000000000000000000000000000000000" as Address,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x600107cf1de17a00000000000000000000000000000000008000000000000000001fffffffffffff1de17a0000000000000000000000000000000000ff1de17a0000000000000000000000000000000000");
  });

  test('encodeAaveV2Repay should match Solidity output', () => {
    
      const result = CalldataLib.encodeAaveV2Repay(
        "0x1De17A0000000000000000000000000000000000" as Address,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x600207cf1de17a00000000000000000000000000000000008000000000000000001fffffffffffff1de17a0000000000000000000000000000000000ff1de17a00000000000000000000000000000000001de17a0000000000000000000000000000000000");
  });

  test('encodeAaveV2Withdraw should match Solidity output', () => {
    
      const result = CalldataLib.encodeAaveV2Withdraw(
        "0x1De17A0000000000000000000000000000000000" as Address,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x600307cf1de17a00000000000000000000000000000000008000000000000000001fffffffffffff1de17a00000000000000000000000000000000001de17a00000000000000000000000000000000001de17a0000000000000000000000000000000000");
  });

  test('encodeCompoundV3Deposit should match Solidity output', () => {
    
      const result = CalldataLib.encodeCompoundV3Deposit(
        "0x1De17A0000000000000000000000000000000000" as Address,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x60000bb71de17a00000000000000000000000000000000008000000000000000001fffffffffffff1de17a00000000000000000000000000000000001de17a0000000000000000000000000000000000");
  });

  test('encodeCompoundV3Borrow should match Solidity output', () => {
    
      const result = CalldataLib.encodeCompoundV3Borrow(
        "0x1De17A0000000000000000000000000000000000" as Address,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x60010bb71de17a00000000000000000000000000000000008000000000000000001fffffffffffff1de17a00000000000000000000000000000000001de17a0000000000000000000000000000000000");
  });

  test('encodeCompoundV3Repay should match Solidity output', () => {
    
      const result = CalldataLib.encodeCompoundV3Repay(
        "0x1De17A0000000000000000000000000000000000" as Address,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x60020bb71de17a00000000000000000000000000000000008000000000000000001fffffffffffff1de17a00000000000000000000000000000000001de17a0000000000000000000000000000000000");
  });

  test('encodeCompoundV3Withdraw should match Solidity output', () => {
    
      const result = CalldataLib.encodeCompoundV3Withdraw(
        "0x1De17A0000000000000000000000000000000000" as Address,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address,
        true
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x60030bb71de17a00000000000000000000000000000000008000000000000000001fffffffffffff1de17a0000000000000000000000000000000000011de17a0000000000000000000000000000000000");
  });

  test('encodeCompoundV2Deposit should match Solidity output', () => {
    
      const result = CalldataLib.encodeCompoundV2Deposit(
        "0x1De17A0000000000000000000000000000000000" as Address,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x60000f9f1de17a00000000000000000000000000000000008000000000000000001fffffffffffff1de17a00000000000000000000000000000000001de17a0000000000000000000000000000000000");
  });

  test('encodeCompoundV2Borrow should match Solidity output', () => {
    
      const result = CalldataLib.encodeCompoundV2Borrow(
        "0x1De17A0000000000000000000000000000000000" as Address,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x60010f9f1de17a00000000000000000000000000000000008000000000000000001fffffffffffff1de17a00000000000000000000000000000000001de17a0000000000000000000000000000000000");
  });

  test('encodeCompoundV2Repay should match Solidity output', () => {
    
      const result = CalldataLib.encodeCompoundV2Repay(
        "0x1De17A0000000000000000000000000000000000" as Address,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x60020f9f1de17a00000000000000000000000000000000008000000000000000001fffffffffffff1de17a00000000000000000000000000000000001de17a0000000000000000000000000000000000");
  });

  test('encodeCompoundV2Withdraw should match Solidity output', () => {
    
      const result = CalldataLib.encodeCompoundV2Withdraw(
        "0x1De17A0000000000000000000000000000000000" as Address,
        true,
        9007199254740991n,
        "0x1De17A0000000000000000000000000000000000" as Address,
        "0x1De17A0000000000000000000000000000000000" as Address
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('0x')).toBe(true);
      expect(result).toBe("0x60030f9f1de17a00000000000000000000000000000000008000000000000000001fffffffffffff1de17a00000000000000000000000000000000001de17a0000000000000000000000000000000000");
  });
});
