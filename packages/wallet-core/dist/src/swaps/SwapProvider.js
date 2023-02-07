"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapProvider = void 0;
const tslib_1 = require("tslib");
const error_parser_1 = require("@liquality/error-parser");
const store_1 = tslib_1.__importDefault(require("../store"));
const notification_1 = require("../store/broker/notification");
class SwapProvider {
    constructor(config) {
        this.config = config;
    }
    sendLedgerNotification(accountId, message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const account = store_1.default.getters.accountItem(accountId);
            if (account === null || account === void 0 ? void 0 : account.type.includes('ledger')) {
                yield (0, notification_1.createNotification)({ title: 'Sign with Ledger', message });
            }
        });
    }
    waitForSwapConfirmations(_nextSwapActionRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    getMarketData(network) {
        return store_1.default.state.marketData[network];
    }
    getClient(network, walletId, asset, accountId) {
        const chainId = store_1.default.getters.cryptoassets[asset].chain;
        return store_1.default.getters.client({ network, walletId, chainId, accountId });
    }
    getAccount(accountId) {
        return store_1.default.getters.accountItem(accountId);
    }
    updateBalances(network, walletId, accountIds) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return store_1.default.dispatch.updateBalances({ network, walletId, accountIds });
        });
    }
    getSwapAddress(network, walletId, asset, accountId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const [address] = yield store_1.default.dispatch.getUnusedAddresses({ network, walletId, assets: [asset], accountId });
            return address;
        });
    }
    get statuses() {
        const statuses = this._getStatuses();
        if (typeof statuses === 'undefined')
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.SwapProvider.Statuses);
        return statuses;
    }
    get fromTxType() {
        const fromTxType = this._fromTxType();
        if (typeof fromTxType === 'undefined') {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.SwapProvider.FromTxType);
        }
        return fromTxType;
    }
    get toTxType() {
        const toTxType = this._toTxType();
        if (typeof toTxType === 'undefined') {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.SwapProvider.ToTxType);
        }
        return toTxType;
    }
    get timelineDiagramSteps() {
        const timelineDiagramSteps = this._timelineDiagramSteps();
        if (typeof timelineDiagramSteps === 'undefined') {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.SwapProvider.timelineDiagramSteps);
        }
        return timelineDiagramSteps;
    }
    get totalSteps() {
        const totalSteps = this._totalSteps();
        if (typeof totalSteps === 'undefined') {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.SwapProvider.totalSteps);
        }
        return totalSteps;
    }
    get txTypes() {
        const totalSteps = this._txTypes();
        if (typeof totalSteps === 'undefined') {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.SwapProvider._txTypes);
        }
        return totalSteps;
    }
}
exports.SwapProvider = SwapProvider;
//# sourceMappingURL=SwapProvider.js.map