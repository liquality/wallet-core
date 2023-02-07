"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderAssets = exports.orderChains = exports.getCurrenciesInfo = exports.getPrices = exports.shouldApplyRskLegacyDerivation = exports.unlockAsset = exports.attemptToLockAsset = exports.timestamp = exports.waitForRandom = exports.wait = exports.emitter = exports.CHAIN_LOCK = exports.clientCache = void 0;
const tslib_1 = require("tslib");
const client_1 = require("@chainify/client");
const evm_1 = require("@chainify/evm");
const cryptoassets_1 = require("@liquality/cryptoassets");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const events_1 = tslib_1.__importDefault(require("events"));
const lodash_1 = require("lodash");
const cryptoassets_2 = tslib_1.__importDefault(require("../utils/cryptoassets"));
const types_1 = require("./types");
exports.clientCache = {};
exports.CHAIN_LOCK = {};
exports.emitter = new events_1.default();
const wait = (millis) => new Promise((resolve) => setTimeout(() => resolve(), millis));
exports.wait = wait;
const waitForRandom = (min, max) => wait((0, lodash_1.random)(min, max));
exports.waitForRandom = waitForRandom;
const timestamp = () => Date.now();
exports.timestamp = timestamp;
const attemptToLockAsset = (network, walletId, asset) => {
    const chain = cryptoassets_2.default[asset].chain;
    const key = [network, walletId, chain].join('-');
    if (exports.CHAIN_LOCK[key]) {
        return {
            key,
            success: false,
        };
    }
    exports.CHAIN_LOCK[key] = true;
    return {
        key,
        success: true,
    };
};
exports.attemptToLockAsset = attemptToLockAsset;
const unlockAsset = (key) => {
    exports.CHAIN_LOCK[key] = false;
    exports.emitter.emit(`unlock:${key}`);
};
exports.unlockAsset = unlockAsset;
const COIN_GECKO_API = 'https://api.coingecko.com/api/v3';
const getRskERC20Assets = () => {
    const erc20 = Object.keys(cryptoassets_2.default).filter((asset) => cryptoassets_2.default[asset].chain === cryptoassets_1.ChainId.Rootstock && cryptoassets_2.default[asset].type === cryptoassets_1.AssetTypes.erc20);
    return erc20.map((erc) => cryptoassets_2.default[erc]);
};
const shouldApplyRskLegacyDerivation = (accounts, mnemonic, indexPath = 0) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const rskERC20Assets = getRskERC20Assets().map((asset) => {
        return Object.assign(Object.assign({}, asset), { isNative: asset.type === 'native' });
    });
    const walletIds = Object.keys(accounts);
    const addresses = [];
    walletIds.forEach((wallet) => {
        const walletAccounts = accounts[wallet].mainnet;
        walletAccounts.forEach((account) => {
            if (account.chain === cryptoassets_1.ChainId.Rootstock) {
                addresses.push(...account.addresses);
            }
        });
    });
    if (mnemonic) {
        const walletProvider = new evm_1.EvmWalletProvider({ mnemonic, derivationPath: `m/44'/137'/${indexPath}'/0/0` });
        const _addresses = yield walletProvider.getAddresses();
        addresses.push(..._addresses.map((e) => e.address));
    }
    const rskMainnetNetwork = (0, cryptoassets_1.getChain)(types_1.Network.Mainnet, cryptoassets_1.ChainId.Rootstock).network;
    const chainProvider = new evm_1.EvmChainProvider(rskMainnetNetwork);
    const balances = yield chainProvider.getBalance(addresses, rskERC20Assets);
    return balances.some((amount) => amount.isGreaterThan(0));
});
exports.shouldApplyRskLegacyDerivation = shouldApplyRskLegacyDerivation;
function getPrices(baseCurrencies, toCurrency) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const coindIds = baseCurrencies
            .filter((currency) => { var _a, _b; return (_b = (_a = cryptoassets_2.default[currency]) === null || _a === void 0 ? void 0 : _a.priceSource) === null || _b === void 0 ? void 0 : _b.coinGeckoId; })
            .map((currency) => { var _a; return (_a = cryptoassets_2.default[currency].priceSource) === null || _a === void 0 ? void 0 : _a.coinGeckoId; });
        const data = yield client_1.HttpClient.get(`${COIN_GECKO_API}/simple/price?ids=${coindIds.join(',')}&vs_currencies=${toCurrency}`);
        let prices = (0, lodash_1.mapKeys)(data, (_, coinGeckoId) => (0, lodash_1.findKey)(cryptoassets_2.default, (asset) => { var _a; return ((_a = asset.priceSource) === null || _a === void 0 ? void 0 : _a.coinGeckoId) === coinGeckoId; }));
        prices = (0, lodash_1.mapValues)(prices, (rates) => (0, lodash_1.mapKeys)(rates, (_, k) => k.toUpperCase()));
        for (const baseCurrency of baseCurrencies) {
            if (!prices[baseCurrency] && ((_a = cryptoassets_2.default[baseCurrency]) === null || _a === void 0 ? void 0 : _a.matchingAsset)) {
                prices[baseCurrency] = prices[cryptoassets_2.default[baseCurrency].matchingAsset];
            }
        }
        const symbolPrices = (0, lodash_1.mapValues)(prices, (rates, key) => {
            const _toCurrency = toCurrency.toUpperCase();
            if (rates && rates[_toCurrency]) {
                return rates[_toCurrency];
            }
            else {
                console.error(`${_toCurrency} rate is missing for ${key}`);
            }
        });
        return symbolPrices;
    });
}
exports.getPrices = getPrices;
function getCurrenciesInfo(baseCurrencies) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const coindIds = baseCurrencies
            .filter((currency) => { var _a, _b; return (_b = (_a = cryptoassets_2.default[currency]) === null || _a === void 0 ? void 0 : _a.priceSource) === null || _b === void 0 ? void 0 : _b.coinGeckoId; })
            .map((currency) => {
            var _a;
            return ({
                asset: currency,
                coinGeckoId: (_a = cryptoassets_2.default[currency].priceSource) === null || _a === void 0 ? void 0 : _a.coinGeckoId,
            });
        });
        const data = (yield Promise.all([
            client_1.HttpClient.get(`${COIN_GECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false`),
            client_1.HttpClient.get(`${COIN_GECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=2&sparkline=false`),
        ])).flat();
        return coindIds.reduce((acc, currValue) => {
            const { coinGeckoId, asset } = currValue;
            const coinInfo = data.find((coin) => coin.id === coinGeckoId);
            return (acc = Object.assign(Object.assign({}, acc), { [asset]: coinInfo ? new bignumber_js_1.default(coinInfo.market_cap) : new bignumber_js_1.default(0) }));
        }, {});
    });
}
exports.getCurrenciesInfo = getCurrenciesInfo;
const orderChains = (firstChain, secondChain) => {
    if (firstChain.totalFiatBalance.gt(secondChain.totalFiatBalance)) {
        return -1;
    }
    if (secondChain.totalFiatBalance.gt(firstChain.totalFiatBalance)) {
        return 1;
    }
    if (firstChain.nativeAssetMarketCap.gt(secondChain.nativeAssetMarketCap)) {
        return -1;
    }
    if (secondChain.nativeAssetMarketCap.gt(firstChain.nativeAssetMarketCap)) {
        return 1;
    }
    return firstChain.chain < secondChain.chain ? -1 : 1;
};
exports.orderChains = orderChains;
const orderAssets = (hasFiat, hasTokenBalance, sortedAssetsByFiat, sortedAssetsByMarketCap, sortedAssetsByTokenBalance) => {
    let orderedAssets = [];
    if (hasFiat) {
        orderedAssets = [...sortedAssetsByFiat];
        if (hasTokenBalance) {
            orderedAssets = [...orderedAssets, ...sortedAssetsByTokenBalance, ...sortedAssetsByMarketCap];
        }
        else {
            orderedAssets = [...orderedAssets, ...sortedAssetsByMarketCap, ...sortedAssetsByTokenBalance];
        }
    }
    else if (hasTokenBalance) {
        orderedAssets = [...sortedAssetsByTokenBalance, ...sortedAssetsByMarketCap, ...sortedAssetsByFiat];
    }
    else {
        orderedAssets = [...sortedAssetsByMarketCap, ...sortedAssetsByFiat, ...sortedAssetsByTokenBalance];
    }
    const nativeAssetIdx = orderedAssets.findIndex((asset) => asset.type === 'native');
    if (nativeAssetIdx !== -1) {
        const nativeAsset = orderedAssets.splice(nativeAssetIdx, 1)[0];
        return [nativeAsset, ...orderedAssets].map((asset) => asset.asset);
    }
    return orderedAssets.map((asset) => asset.asset);
};
exports.orderAssets = orderAssets;
//# sourceMappingURL=utils.js.map