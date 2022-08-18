/* eslint-disable no-undef */
import { ChainId } from '@liquality/cryptoassets';
import { AccountType, Network } from '../store/types';
import { getDerivationPath } from './derivationPath';

// Bitcoin
test('get bitcoin derivation path for default account type Segwit', () => {
  expect(getDerivationPath(ChainId.Bitcoin, Network.Mainnet, 0, AccountType.Default)).toBe("84'/0'/0'");
});

test('get bitcoin derivation path for ledger account type Segwit', () => {
  expect(getDerivationPath(ChainId.Bitcoin, Network.Mainnet, 0, AccountType.BitcoinLedgerNativeSegwit)).toBe(
    "84'/0'/0'"
  );
});

test('get bitcoin derivation path for ledger account type Legacy', () => {
  expect(getDerivationPath(ChainId.Bitcoin, Network.Mainnet, 0, AccountType.BitcoinLedgerLegacy)).toBe("44'/0'/0'");
});

// Ethereum
test('get ETH derivation path for default accounts on mainnet and testnet', () => {
  const ethPathMainnet = getDerivationPath(ChainId.Ethereum, Network.Mainnet, 0, AccountType.Default);
  const ethPathTestnet = getDerivationPath(ChainId.Ethereum, Network.Testnet, 0, AccountType.Default);
  expect(ethPathMainnet).toBe("m/44'/60'/0'/0/0");
  expect(ethPathMainnet).toEqual(ethPathTestnet);
});

// RSK
test('get RSK derivation path for Ledger accounts on mainnet', () => {
  expect(getDerivationPath(ChainId.Rootstock, Network.Mainnet, 0, AccountType.RskLedger)).toBe("m/44'/137'/0'/0/0");
});

test('get RSK derivation path for Ledger accounts on testnet', () => {
  expect(getDerivationPath(ChainId.Rootstock, Network.Testnet, 0, AccountType.RskLedger)).toBe("m/44'/37310'/0'/0/0");
});

test('get RSK derivation path for default accounts on mainnet', () => {
  const ethPath = getDerivationPath(ChainId.Ethereum, Network.Mainnet, 0, AccountType.Default);
  expect(getDerivationPath(ChainId.Rootstock, Network.Mainnet, 0, AccountType.Default)).toBe("m/44'/60'/0'/0/0");
  expect(ethPath).toEqual(ethPath);
});

test('get RSK derivation path for default accounts on testnet', () => {
  const ethPath = getDerivationPath(ChainId.Ethereum, Network.Testnet, 0, AccountType.Default);
  expect(getDerivationPath(ChainId.Rootstock, Network.Testnet, 0, AccountType.Default)).toBe("m/44'/60'/0'/0/0");
  expect(ethPath).toEqual(ethPath);
});
