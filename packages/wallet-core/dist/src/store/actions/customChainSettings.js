"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCustomChainSettings = exports.saveCustomChainSettings = void 0;
const __1 = require("..");
const utils_1 = require("../utils");
const saveCustomChainSettings = (context, { network, walletId, chainId, chanifyNetwork, }) => {
    const { commit } = (0, __1.rootActionContext)(context);
    commit.SET_CUSTOM_CHAIN_SETTINGS({
        network,
        walletId,
        chainId,
        chanifyNetwork,
    });
    clearClientCache({ network, walletId, chainId });
};
exports.saveCustomChainSettings = saveCustomChainSettings;
const removeCustomChainSettings = (context, { network, walletId, chainId }) => {
    const { commit } = (0, __1.rootActionContext)(context);
    commit.REMOVE_CUSTOM_CHAIN_SETTINGS({
        network,
        walletId,
        chainId,
    });
    clearClientCache({ network, walletId, chainId });
};
exports.removeCustomChainSettings = removeCustomChainSettings;
const clearClientCache = ({ network, walletId, chainId, }) => {
    const cacheKey = [chainId, network, walletId].join('-');
    Object.keys(utils_1.clientCache)
        .filter((k) => k.startsWith(cacheKey))
        .forEach((k) => {
        if (utils_1.clientCache[k]) {
            delete utils_1.clientCache[k];
        }
    });
};
//# sourceMappingURL=customChainSettings.js.map