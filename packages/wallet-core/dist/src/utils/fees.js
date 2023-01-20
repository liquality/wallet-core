"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateTransferNFT = exports.newSendFees = exports.feePerUnit = exports.maxFeePerUnitEIP1559 = exports.probableFeePerUnitEIP1559 = exports.sendBitcoinTxFees = exports.sendTxFeesInNativeAsset = exports.getSendTxFees = exports.isEIP1559Fees = exports.getFeeLabel = exports.getTxFee = exports.getSendFee = exports.FEE_OPTIONS = void 0;
const tslib_1 = require("tslib");
const evm_1 = require("@chainify/evm");
const types_1 = require("@chainify/types");
const cryptoassets_1 = require("@liquality/cryptoassets");
const error_parser_1 = require("@liquality/error-parser");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const store_1 = tslib_1.__importDefault(require("../store"));
const types_2 = require("../store/types");
const asset_1 = require("./asset");
const cryptoassets_2 = tslib_1.__importDefault(require("./cryptoassets"));
function newSendFees() {
    return { slow: new bignumber_js_1.default(0), average: new bignumber_js_1.default(0), fast: new bignumber_js_1.default(0), custom: new bignumber_js_1.default(0) };
}
exports.newSendFees = newSendFees;
const FEE_OPTIONS = {
    SLOW: { name: 'Slow', label: 'Slow' },
    AVERAGE: { name: 'Average', label: 'Avg' },
    FAST: { name: 'Fast', label: 'Fast' },
    CUSTOM: { name: 'Custom', label: 'Custom' },
};
exports.FEE_OPTIONS = FEE_OPTIONS;
const feePriceInUnit = (asset, feePrice, network = types_2.Network.Mainnet) => {
    return (0, asset_1.isChainEvmCompatible)(asset, network) ? evm_1.EvmUtils.fromGwei(feePrice) : feePrice;
};
function getSendFee(asset, feePrice, l1FeePrice, network = types_2.Network.Mainnet) {
    const assetInfo = cryptoassets_2.default[asset];
    const nativeAssetInfo = cryptoassets_2.default[(0, asset_1.getNativeAsset)(asset)];
    if (assetInfo.chain === types_1.ChainId.Optimism) {
        const gasLimitL1 = (0, cryptoassets_1.getAssetSendL1GasLimit)(assetInfo, network);
        if (!gasLimitL1) {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Chain.L1GasLimit(assetInfo.chain));
        }
        if (!l1FeePrice) {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Chain.L1FeePrice);
        }
        const feeL1 = new bignumber_js_1.default(gasLimitL1).times(feePriceInUnit(nativeAssetInfo.code, l1FeePrice, network));
        const gasLimitL2 = (0, cryptoassets_1.getAssetSendGasLimit)(assetInfo, network);
        if (!gasLimitL2) {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Chain.GasLimit(assetInfo.chain));
        }
        const feeL2 = new bignumber_js_1.default(gasLimitL2).times(feePriceInUnit(nativeAssetInfo.code, feePrice, network));
        return (0, cryptoassets_1.unitToCurrency)(nativeAssetInfo, feeL1.plus(feeL2));
    }
    else {
        const gasLimitL = (0, cryptoassets_1.getAssetSendGasLimit)(assetInfo, network);
        if (!gasLimitL) {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Chain.GasLimit(assetInfo.chain));
        }
        const fee = new bignumber_js_1.default(gasLimitL).times(feePriceInUnit(nativeAssetInfo.code, feePrice, network));
        return (0, cryptoassets_1.unitToCurrency)(nativeAssetInfo, fee);
    }
}
exports.getSendFee = getSendFee;
function getTxFee(units, _asset, _feePrice) {
    const chainId = cryptoassets_2.default[_asset].chain;
    const asset = (0, asset_1.isERC20)(_asset) ? 'ERC20' : _asset;
    const feeUnits = chainId === 'terra' ? units['LUNA'] : units[asset];
    const fee = new bignumber_js_1.default(feeUnits).times(feePriceInUnit(_asset, _feePrice));
    return (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[(0, asset_1.getNativeAsset)(_asset)], fee);
}
exports.getTxFee = getTxFee;
function getFeeLabel(fee) {
    var _a;
    const name = ((fee === null || fee === void 0 ? void 0 : fee.toUpperCase()) || '');
    return ((_a = FEE_OPTIONS[name]) === null || _a === void 0 ? void 0 : _a.label) || '';
}
exports.getFeeLabel = getFeeLabel;
function isEIP1559Fees(chain) {
    return chain === types_1.ChainId.Ethereum || chain === types_1.ChainId.Polygon || chain === types_1.ChainId.Avalanche;
}
exports.isEIP1559Fees = isEIP1559Fees;
function probableFeePerUnitEIP1559(suggestedGasFee) {
    if (suggestedGasFee.suggestedBaseFeePerGas === undefined) {
        return suggestedGasFee.maxPriorityFeePerGas;
    }
    return suggestedGasFee.suggestedBaseFeePerGas + suggestedGasFee.maxPriorityFeePerGas;
}
exports.probableFeePerUnitEIP1559 = probableFeePerUnitEIP1559;
function maxFeePerUnitEIP1559(suggestedGasFee) {
    return suggestedGasFee.maxFeePerGas;
}
exports.maxFeePerUnitEIP1559 = maxFeePerUnitEIP1559;
function feePerUnit(suggestedGasFee, chain) {
    if (suggestedGasFee === undefined || chain === undefined) {
        throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.Invalid.Default);
    }
    if (!isEIP1559Fees(chain) && typeof suggestedGasFee === 'number') {
        return suggestedGasFee;
    }
    if (isEIP1559Fees(chain) && typeof suggestedGasFee === 'object') {
        return maxFeePerUnitEIP1559(suggestedGasFee);
    }
    if (typeof suggestedGasFee === 'number') {
        return suggestedGasFee;
    }
    throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.Invalid.ChainGasFeeMisMatch);
}
exports.feePerUnit = feePerUnit;
function getSendTxFees(accountId, asset, amount, customFee) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const assetChain = (_a = cryptoassets_2.default[asset]) === null || _a === void 0 ? void 0 : _a.chain;
        if (!assetChain) {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Asset.Chain(asset));
        }
        const feeAsset = (0, asset_1.getFeeAsset)(asset) || (0, asset_1.getNativeAsset)(asset);
        if (!feeAsset) {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Asset.FeeAsset(asset));
        }
        const suggestedGasFees = store_1.default.getters.suggestedFeePrices(feeAsset);
        if (!suggestedGasFees) {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Asset.Fees(feeAsset));
        }
        const _suggestedGasFees = suggestedGasFees;
        if (customFee) {
            _suggestedGasFees.custom = { fee: customFee };
        }
        if (assetChain === types_1.ChainId.Bitcoin) {
            return sendBitcoinTxFees(accountId, asset, _suggestedGasFees, amount);
        }
        else {
            return sendTxFeesInNativeAsset(asset, _suggestedGasFees);
        }
    });
}
exports.getSendTxFees = getSendTxFees;
function sendTxFeesInNativeAsset(asset, suggestedGasFees, sendFees) {
    var _a, _b;
    const assetChain = (_a = cryptoassets_2.default[asset]) === null || _a === void 0 ? void 0 : _a.chain;
    const _sendFees = sendFees !== null && sendFees !== void 0 ? sendFees : newSendFees();
    for (const [speed, fee] of Object.entries(suggestedGasFees)) {
        const _speed = speed;
        const _fee = feePerUnit(fee.fee, assetChain);
        _sendFees[_speed] = _sendFees[_speed].plus(getSendFee(asset, _fee, (_b = fee.multilayerFee) === null || _b === void 0 ? void 0 : _b.l1));
    }
    return _sendFees;
}
exports.sendTxFeesInNativeAsset = sendTxFeesInNativeAsset;
function sendBitcoinTxFees(accountId, asset, suggestedGasFees, amount, sendFees) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (asset != 'BTC') {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.Invalid.Default);
        }
        const isMax = amount === undefined;
        const _sendFees = sendFees !== null && sendFees !== void 0 ? sendFees : newSendFees();
        const account = store_1.default.getters.accountItem(accountId);
        const client = store_1.default.getters.client({
            network: store_1.default.state.activeNetwork,
            walletId: store_1.default.state.activeWalletId,
            chainId: account.chain,
            accountId: accountId,
        });
        const feePerBytes = Object.values(suggestedGasFees).map((fee) => fee.fee);
        const value = isMax ? undefined : (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[asset], amount);
        try {
            const txs = feePerBytes.map((fee) => ({ value, fee }));
            const totalFees = yield client.wallet.getTotalFees(txs, isMax);
            for (const [speed, fee] of Object.entries(suggestedGasFees)) {
                const totalFee = (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[asset], totalFees[fee.fee]);
                _sendFees[speed] = totalFee;
            }
        }
        catch (e) {
            console.error(e);
        }
        return _sendFees;
    });
}
exports.sendBitcoinTxFees = sendBitcoinTxFees;
function estimateTransferNFT(accountId, network, receiver, values, nft, customFee) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const account = store_1.default.getters.accountItem(accountId);
        const feeAsset = (0, cryptoassets_1.getNativeAssetCode)(network, account.chain);
        if (!feeAsset) {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Asset.FeeAsset());
        }
        const suggestedGasFees = store_1.default.getters.suggestedFeePrices(feeAsset);
        if (!suggestedGasFees) {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Asset.Fees(feeAsset));
        }
        const _suggestedGasFees = suggestedGasFees;
        if (customFee) {
            _suggestedGasFees.custom = { fee: customFee };
        }
        const client = store_1.default.getters.client({
            network: store_1.default.state.activeNetwork,
            walletId: store_1.default.state.activeWalletId,
            chainId: account.chain,
            accountId: accountId,
        });
        let _receiver = receiver;
        if (!receiver && (0, asset_1.isChainEvmCompatible)(feeAsset, network)) {
            _receiver = '0x' + 'f'.repeat(40);
        }
        const _sendFees = newSendFees();
        try {
            const estimation = yield client.nft.estimateTransfer(nft.asset_contract.address, _receiver, [nft.token_id], values);
            for (const [speed, fee] of Object.entries(suggestedGasFees)) {
                const _speed = speed;
                const _fee = feePerUnit(fee.fee, account.chain);
                _sendFees[_speed] = new bignumber_js_1.default(estimation).times(_fee).div(1e9);
            }
            return _sendFees;
        }
        catch (e) {
            if (e.name === 'UnsupportedMethodError' || ((_a = e.rawError) === null || _a === void 0 ? void 0 : _a.name) === 'UnsupportedMethodError') {
                for (const [speed, fee] of Object.entries(suggestedGasFees)) {
                    const _speed = speed;
                    _sendFees[_speed] = new bignumber_js_1.default(feePerUnit(fee.fee, account.chain));
                }
                return _sendFees;
            }
            throw e;
        }
    });
}
exports.estimateTransferNFT = estimateTransferNFT;
//# sourceMappingURL=fees.js.map