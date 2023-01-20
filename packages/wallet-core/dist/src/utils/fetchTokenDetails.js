"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAINS_WITH_FETCH_TOKEN_DETAILS = void 0;
const cryptoassets_1 = require("@liquality/cryptoassets");
const types_1 = require("../store/types");
exports.CHAINS_WITH_FETCH_TOKEN_DETAILS = Object.values(cryptoassets_1.ChainId).reduce((result, chainId) => {
    const chain = (0, cryptoassets_1.getChain)(types_1.Network.Mainnet, chainId);
    if (chain.hasTokens) {
        result.push({
            chainId,
            label: `${capitalizeFirstLetter(chain.name)} (${chain.nativeAsset[0].code.toUpperCase()})`,
        });
    }
    return result;
}, []);
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
//# sourceMappingURL=fetchTokenDetails.js.map