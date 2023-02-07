"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cryptoassets_1 = require("@liquality/cryptoassets");
const types_1 = require("../store/types");
const derivationPath_1 = require("./derivationPath");
test('get bitcoin derivation path for default account type Segwit', () => {
    expect((0, derivationPath_1.getDerivationPath)(cryptoassets_1.ChainId.Bitcoin, types_1.Network.Mainnet, 0, types_1.AccountType.Default)).toBe("84'/0'/0'");
});
test('get bitcoin derivation path for ledger account type Segwit', () => {
    expect((0, derivationPath_1.getDerivationPath)(cryptoassets_1.ChainId.Bitcoin, types_1.Network.Mainnet, 0, types_1.AccountType.BitcoinLedgerNativeSegwit)).toBe("84'/0'/0'");
});
test('get bitcoin derivation path for ledger account type Legacy', () => {
    expect((0, derivationPath_1.getDerivationPath)(cryptoassets_1.ChainId.Bitcoin, types_1.Network.Mainnet, 0, types_1.AccountType.BitcoinLedgerLegacy)).toBe("44'/0'/0'");
});
test('get ETH derivation path for default accounts on mainnet and testnet', () => {
    const ethPathMainnet = (0, derivationPath_1.getDerivationPath)(cryptoassets_1.ChainId.Ethereum, types_1.Network.Mainnet, 0, types_1.AccountType.Default);
    const ethPathTestnet = (0, derivationPath_1.getDerivationPath)(cryptoassets_1.ChainId.Ethereum, types_1.Network.Testnet, 0, types_1.AccountType.Default);
    expect(ethPathMainnet).toBe("m/44'/60'/0'/0/0");
    expect(ethPathMainnet).toEqual(ethPathTestnet);
});
test('get RSK derivation path for Ledger accounts on mainnet', () => {
    expect((0, derivationPath_1.getDerivationPath)(cryptoassets_1.ChainId.Rootstock, types_1.Network.Mainnet, 0, types_1.AccountType.RskLedger)).toBe("m/44'/137'/0'/0/0");
});
test('get RSK derivation path for Ledger accounts on testnet', () => {
    expect((0, derivationPath_1.getDerivationPath)(cryptoassets_1.ChainId.Rootstock, types_1.Network.Testnet, 0, types_1.AccountType.RskLedger)).toBe("m/44'/37310'/0'/0/0");
});
test('get RSK derivation path for default accounts on mainnet', () => {
    const ethPath = (0, derivationPath_1.getDerivationPath)(cryptoassets_1.ChainId.Ethereum, types_1.Network.Mainnet, 0, types_1.AccountType.Default);
    expect((0, derivationPath_1.getDerivationPath)(cryptoassets_1.ChainId.Rootstock, types_1.Network.Mainnet, 0, types_1.AccountType.Default)).toBe("m/44'/60'/0'/0/0");
    expect(ethPath).toEqual(ethPath);
});
test('get RSK derivation path for default accounts on testnet', () => {
    const ethPath = (0, derivationPath_1.getDerivationPath)(cryptoassets_1.ChainId.Ethereum, types_1.Network.Testnet, 0, types_1.AccountType.Default);
    expect((0, derivationPath_1.getDerivationPath)(cryptoassets_1.ChainId.Rootstock, types_1.Network.Testnet, 0, types_1.AccountType.Default)).toBe("m/44'/60'/0'/0/0");
    expect(ethPath).toEqual(ethPath);
});
//# sourceMappingURL=derivationPath.spec.js.map