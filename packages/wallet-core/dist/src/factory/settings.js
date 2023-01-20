"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultChainSettings = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const networks_1 = require("../utils/networks");
const build_config_1 = tslib_1.__importDefault(require("../build.config"));
exports.defaultChainSettings = build_config_1.default.networks.reduce((prevNetwork, currNetwork) => {
    const chains = build_config_1.default.chains.reduce((prevChain, currChain) => {
        const chain = (0, cryptoassets_1.getChain)(currNetwork, currChain);
        const { network } = chain;
        const { name, coinType, isTestnet, rpcUrls } = network;
        const chainNetwork = networks_1.ChainNetworks[currChain] ? networks_1.ChainNetworks[currChain][currNetwork] : {} || {};
        let chainifyNetwork = Object.assign(Object.assign({ name,
            coinType,
            isTestnet, chainId: currChain, rpcUrl: rpcUrls && rpcUrls.length > 0 ? rpcUrls[0] : undefined }, chainNetwork), { custom: false });
        if (currChain === cryptoassets_1.ChainId.Bitcoin) {
            chainifyNetwork = Object.assign(Object.assign({}, chainifyNetwork), { scraperUrl: build_config_1.default.exploraApis[currNetwork], batchScraperUrl: build_config_1.default.batchEsploraApis[currNetwork], feeProviderUrl: 'https://liquality.io/swap/mempool/v1/fees/recommended' });
        }
        return Object.assign(Object.assign({}, prevChain), { [currChain]: chainifyNetwork });
    }, {});
    return Object.assign(Object.assign({}, prevNetwork), { [currNetwork]: chains });
}, {});
//# sourceMappingURL=settings.js.map