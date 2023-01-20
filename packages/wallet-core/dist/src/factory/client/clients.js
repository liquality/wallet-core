"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSolanaClient = exports.createTerraClient = exports.createNearClient = exports.createBtcClient = void 0;
const client_1 = require("@chainify/client");
const bitcoin_1 = require("@chainify/bitcoin");
const bitcoin_ledger_1 = require("@chainify/bitcoin-ledger");
const near_1 = require("@chainify/near");
const solana_1 = require("@chainify/solana");
const terra_1 = require("@chainify/terra");
const ledger_1 = require("../../utils/ledger");
const walletOptions_1 = require("../../walletOptions");
const error_parser_1 = require("@liquality/error-parser");
function createBtcClient(settings, mnemonic, accountInfo) {
    const isMainnet = settings.network === 'mainnet';
    const { chainifyNetwork } = settings;
    const chainProvider = new bitcoin_1.BitcoinEsploraApiProvider({
        batchUrl: chainifyNetwork.batchScraperUrl,
        url: chainifyNetwork.scraperUrl,
        network: chainifyNetwork,
        numberOfBlockConfirmation: 2,
    });
    if (isMainnet) {
        const feeProvider = new bitcoin_1.BitcoinFeeApiProvider(chainifyNetwork.feeProviderUrl);
        chainProvider.setFeeProvider(feeProvider);
    }
    const swapProvider = new bitcoin_1.BitcoinSwapEsploraProvider({
        network: chainifyNetwork,
        scraperUrl: chainifyNetwork.scraperUrl,
    });
    if (accountInfo.type.includes('bitcoin_ledger')) {
        const option = ledger_1.LEDGER_BITCOIN_OPTIONS.find((o) => o.name === accountInfo.type);
        if (!option) {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.AccountTypeOption(accountInfo.type));
        }
        const { addressType } = option;
        if (!walletOptions_1.walletOptionsStore.walletOptions.ledgerTransportCreator) {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.LedgerTransportCreator);
        }
        const ledgerProvider = new bitcoin_ledger_1.BitcoinLedgerProvider({
            network: chainifyNetwork,
            addressType,
            baseDerivationPath: accountInfo.derivationPath,
            basePublicKey: accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.publicKey,
            baseChainCode: accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.chainCode,
            transportCreator: walletOptions_1.walletOptionsStore.walletOptions.ledgerTransportCreator,
        }, chainProvider);
        swapProvider.setWallet(ledgerProvider);
    }
    else {
        const walletOptions = {
            network: chainifyNetwork,
            baseDerivationPath: accountInfo.derivationPath,
            mnemonic,
        };
        const walletProvider = new bitcoin_1.BitcoinHDWalletProvider(walletOptions, chainProvider);
        swapProvider.setWallet(walletProvider);
    }
    return new client_1.Client().connect(swapProvider);
}
exports.createBtcClient = createBtcClient;
function createNearClient(settings, mnemonic, accountInfo) {
    const walletOptions = {
        mnemonic,
        derivationPath: accountInfo.derivationPath,
        helperUrl: settings.chainifyNetwork.helperUrl,
    };
    const chainProvider = new near_1.NearChainProvider(settings.chainifyNetwork);
    const walletProvider = new near_1.NearWalletProvider(walletOptions, chainProvider);
    const swapProvider = new near_1.NearSwapProvider(settings.chainifyNetwork.helperUrl, walletProvider);
    return new client_1.Client().connect(swapProvider);
}
exports.createNearClient = createNearClient;
function createTerraClient(settings, mnemonic, accountInfo) {
    const { helperUrl } = settings.chainifyNetwork;
    const walletOptions = { mnemonic, derivationPath: accountInfo.derivationPath, helperUrl };
    const chainProvider = new terra_1.TerraChainProvider(settings.chainifyNetwork);
    const walletProvider = new terra_1.TerraWalletProvider(walletOptions, chainProvider);
    const swapProvider = new terra_1.TerraSwapProvider(helperUrl, walletProvider);
    return new client_1.Client().connect(swapProvider);
}
exports.createTerraClient = createTerraClient;
function createSolanaClient(settings, mnemonic, accountInfo) {
    const walletOptions = { mnemonic, derivationPath: accountInfo.derivationPath };
    const chainProvider = new solana_1.SolanaChainProvider(settings.chainifyNetwork);
    const walletProvider = new solana_1.SolanaWalletProvider(walletOptions, chainProvider);
    const nftProvider = new solana_1.SolanaNftProvider(walletProvider, {
        url: 'https://tjgwcry8a7dd.usemoralis.com:2053/server',
        appId: 'PwWfldBBlRaVWGihW4K6LqL4AQbmVNTI3w2OyDhN',
        apiKey: 'X9Bg0wQh5rzvbZ3owmtqAsxdMTy3L81jnz6BNVsj',
    });
    return new client_1.Client().connect(walletProvider).connect(nftProvider);
}
exports.createSolanaClient = createSolanaClient;
//# sourceMappingURL=clients.js.map