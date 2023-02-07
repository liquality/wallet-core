"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTLC_CONTRACT_ADDRESS = exports.assetsAdapter = void 0;
const tslib_1 = require("tslib");
const cryptoassets_1 = require("@liquality/cryptoassets");
const cryptoassets_2 = tslib_1.__importDefault(require("./cryptoassets"));
function assetsAdapter(assets) {
    if (assets instanceof Array) {
        return assets.reduce((result, asset) => {
            if (cryptoassets_2.default[asset]) {
                result.push(parseAsset(cryptoassets_2.default[asset]));
            }
            return result;
        }, []);
    }
    else {
        const result = [];
        if (cryptoassets_2.default[assets]) {
            result.push(parseAsset(cryptoassets_2.default[assets]));
        }
        return result;
    }
}
exports.assetsAdapter = assetsAdapter;
const parseAsset = (asset) => {
    var _a;
    if (asset.type === 'native') {
        return Object.assign(Object.assign({}, asset), { isNative: true });
    }
    else {
        const chainifyAsset = Object.assign(Object.assign({}, asset), { isNative: false });
        switch (asset.chain) {
            case cryptoassets_1.ChainId.Solana:
                return chainifyAsset;
            default:
                return Object.assign(Object.assign({}, chainifyAsset), { contractAddress: (_a = asset.contractAddress) === null || _a === void 0 ? void 0 : _a.toLowerCase() });
        }
    }
};
exports.HTLC_CONTRACT_ADDRESS = '0x133713376F69C1A67d7f3594583349DFB53d8166';
//# sourceMappingURL=chainify.js.map