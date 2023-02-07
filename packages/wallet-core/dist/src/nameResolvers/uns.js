"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUNSKey = exports.UNSResolver = void 0;
const tslib_1 = require("tslib");
const client_1 = require("@chainify/client");
const cryptoassets_1 = require("@liquality/cryptoassets");
const types_1 = require("@liquality/cryptoassets/dist/src/types");
const resolution_1 = require("@unstoppabledomains/resolution");
const build_config_1 = tslib_1.__importDefault(require("../build.config"));
const reg = RegExp('^[.a-z0-9-]+$');
const resolution = new resolution_1.Resolution();
const unsConfig = build_config_1.default.nameResolvers.uns;
function getUNSKey(asset, noVersion = false) {
    const symbol = asset.matchingAsset ? asset.matchingAsset : asset.code;
    if (noVersion) {
        return `crypto.${symbol}.address`;
    }
    const chainKey = multiAssetChainKey(asset.chain);
    if (chainKey) {
        if (asset.type == cryptoassets_1.AssetTypes.native && asset.chain != cryptoassets_1.ChainId.Polygon) {
            return `crypto.${symbol}.address`;
        }
        return `crypto.${symbol}.version.${chainKey}.address`;
    }
    else {
        return `crypto.${symbol}.address`;
    }
}
exports.getUNSKey = getUNSKey;
function multiAssetChainKey(chainId) {
    var _a;
    return ((_a = (0, cryptoassets_1.getChain)(types_1.Network.Mainnet, chainId).nameService) === null || _a === void 0 ? void 0 : _a.uns) || null;
}
class UNSResolver {
    lookupDomain(address, asset) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const domain = this.preparedDomain(address);
                if (yield this.isValidTLD(domain)) {
                    const data = yield client_1.HttpClient.get(unsConfig.resolutionService + domain, {}, { headers: { Authorization: `Bearer ${unsConfig.alchemyKey}` } });
                    return (_b = (_a = data === null || data === void 0 ? void 0 : data.records[getUNSKey(asset)]) !== null && _a !== void 0 ? _a : data === null || data === void 0 ? void 0 : data.records[getUNSKey(asset, true)]) !== null && _b !== void 0 ? _b : null;
                }
                return null;
            }
            catch (e) {
                return null;
            }
        });
    }
    isValidTLD(domain) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.supportedTlds) {
                const data = yield client_1.HttpClient.get(unsConfig.tldAPI);
                if (data.tlds) {
                    this.supportedTlds = data.tlds;
                }
            }
            return (_b = (_a = this.supportedTlds) === null || _a === void 0 ? void 0 : _a.some((tld) => domain.endsWith(tld))) !== null && _b !== void 0 ? _b : false;
        });
    }
    preparedDomain(domain) {
        const retVal = domain ? domain.trim().toLowerCase() : '';
        if (!reg.test(retVal)) {
            throw 'Invalid domain name';
        }
        return retVal;
    }
    reverseLookup(address) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const domain = yield resolution.reverse(address);
                return domain;
            }
            catch (e) {
                return null;
            }
        });
    }
}
exports.UNSResolver = UNSResolver;
//# sourceMappingURL=uns.js.map