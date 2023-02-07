"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRpcUrl = exports.ChainNetworks = exports.Networks = void 0;
const bitcoin_1 = require("@chainify/bitcoin");
const near_1 = require("@chainify/near");
const solana_1 = require("@chainify/solana");
const terra_1 = require("@chainify/terra");
const cryptoassets_1 = require("@liquality/cryptoassets");
const error_parser_1 = require("@liquality/error-parser");
const types_1 = require("../store/types");
exports.Networks = [types_1.Network.Mainnet, types_1.Network.Testnet];
exports.ChainNetworks = {
    [cryptoassets_1.ChainId.Bitcoin]: {
        testnet: bitcoin_1.BitcoinNetworks.bitcoin_testnet,
        mainnet: bitcoin_1.BitcoinNetworks.bitcoin,
    },
    [cryptoassets_1.ChainId.Near]: {
        testnet: near_1.NearNetworks.near_testnet,
        mainnet: Object.assign(Object.assign({}, near_1.NearNetworks.near_mainnet), { rpcUrl: process.env.VUE_APP_NEAR_MAINNET_URL || near_1.NearNetworks.near_mainnet.rpcUrl }),
    },
    [cryptoassets_1.ChainId.Solana]: {
        testnet: solana_1.SolanaNetworks.solana_testnet,
        mainnet: Object.assign(Object.assign({}, solana_1.SolanaNetworks.solana_mainnet), { rpcUrl: process.env.VUE_APP_SOLANA_MAINNET_URL || solana_1.SolanaNetworks.solana_mainnet.rpcUrl }),
    },
    [cryptoassets_1.ChainId.Terra]: {
        testnet: Object.assign(Object.assign({}, terra_1.TerraNetworks.terra_testnet), { rpcUrl: 'https://pisco-lcd.terra.dev', helperUrl: 'https://pisco-fcd.terra.dev' }),
        mainnet: Object.assign(Object.assign({}, terra_1.TerraNetworks.terra_mainnet), { rpcUrl: process.env.VUE_APP_TERRA_MAINNET_URL || terra_1.TerraNetworks.terra_mainnet.rpcUrl }),
    },
};
function getRpcUrl(chainId, network = types_1.Network.Mainnet) {
    const rpcUrl = (0, cryptoassets_1.getChain)(network, chainId).network.rpcUrls[0];
    if (!rpcUrl) {
        throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.RPC(chainId, network));
    }
    return rpcUrl;
}
exports.getRpcUrl = getRpcUrl;
//# sourceMappingURL=networks.js.map