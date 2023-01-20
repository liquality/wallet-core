"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvmClient = void 0;
const client_1 = require("@chainify/client");
const evm_1 = require("@chainify/evm");
const evm_ledger_1 = require("@chainify/evm-ledger");
const types_1 = require("@chainify/types");
const providers_1 = require("@ethersproject/providers");
const types_2 = require("../../store/types");
const walletOptions_1 = require("../../walletOptions");
const nft_1 = require("./nft");
const sdk_1 = require("@eth-optimism/sdk");
const error_parser_1 = require("@liquality/error-parser");
function createEvmClient(chain, settings, mnemonic, accountInfo) {
    const chainProvider = getEvmProvider(chain, settings);
    const walletProvider = getEvmWalletProvider(settings.chainifyNetwork, accountInfo, chainProvider, mnemonic);
    const client = new client_1.Client().connect(walletProvider);
    if (chain.nftProviderType) {
        const nftProvider = (0, nft_1.getNftProvider)(chain.nftProviderType, walletProvider, settings.chainifyNetwork.isTestnet);
        client.connect(nftProvider);
    }
    return client;
}
exports.createEvmClient = createEvmClient;
function getEvmWalletProvider(network, accountInfo, chainProvider, mnemonic) {
    if (accountInfo.type === types_2.AccountType.EthereumLedger || accountInfo.type === types_2.AccountType.RskLedger) {
        let addressCache;
        if (accountInfo && accountInfo.publicKey && accountInfo.address) {
            addressCache = new types_1.Address({ publicKey: accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.publicKey, address: accountInfo.address });
        }
        if (!walletOptions_1.walletOptionsStore.walletOptions.ledgerTransportCreator) {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.LedgerTransportCreator);
        }
        return new evm_ledger_1.EvmLedgerProvider({
            network: network,
            derivationPath: accountInfo.derivationPath,
            addressCache,
            transportCreator: walletOptions_1.walletOptionsStore.walletOptions.ledgerTransportCreator,
        }, chainProvider);
    }
    else {
        const walletOptions = { derivationPath: accountInfo.derivationPath, mnemonic };
        return new evm_1.EvmWalletProvider(walletOptions, chainProvider);
    }
}
function getEvmProvider(chain, settings) {
    const network = settings.chainifyNetwork;
    if (chain.isMultiLayered) {
        const provider = (0, sdk_1.asL2Provider)(new providers_1.StaticJsonRpcProvider(network.rpcUrl, chain.network.chainId));
        return new evm_1.OptimismChainProvider(Object.assign(Object.assign({}, settings.chainifyNetwork), { chainId: chain.network.chainId }), provider, chain.feeMultiplier);
    }
    else {
        const provider = new providers_1.StaticJsonRpcProvider(network.rpcUrl, chain.network.chainId);
        const feeProvider = getFeeProvider(chain, provider);
        return new evm_1.EvmChainProvider(chain.network, provider, feeProvider, chain.multicallSupport);
    }
}
function getFeeProvider(chain, provider) {
    if (chain.EIP1559) {
        return new evm_1.EIP1559FeeProvider(provider);
    }
    else {
        return new evm_1.RpcFeeProvider(provider, chain.feeMultiplier);
    }
}
//# sourceMappingURL=evm.js.map