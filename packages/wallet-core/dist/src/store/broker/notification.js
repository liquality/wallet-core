"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHistoryNotification = exports.createNotification = void 0;
const tslib_1 = require("tslib");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const swap_1 = require("../../factory/swap");
const coinFormatter_1 = require("../../utils/coinFormatter");
const walletOptions_1 = require("../../walletOptions");
const SEND_STATUS_MAP = {
    WAITING_FOR_CONFIRMATIONS(item) {
        return {
            title: `New ${item.from} Transaction`,
            message: `Sending ${(0, coinFormatter_1.prettyBalance)(new bignumber_js_1.default(item.amount), item.from)} ${item.from} to ${item.toAddress}`,
        };
    },
    FAILED(item) {
        return {
            title: `${item.from} Transaction Failed`,
            message: `Failed to send ${(0, coinFormatter_1.prettyBalance)(new bignumber_js_1.default(item.amount), item.from)} ${item.from} to ${item.toAddress}`,
        };
    },
    SUCCESS(item) {
        return {
            title: `${item.from} Transaction Confirmed`,
            message: `Sent ${(0, coinFormatter_1.prettyBalance)(new bignumber_js_1.default(item.amount), item.from)} ${item.from} to ${item.toAddress}`,
        };
    },
};
const NFT_SEND_STATUS_MAP = {
    WAITING_FOR_CONFIRMATIONS(item) {
        return {
            title: `New ${item.from} Transaction`,
            message: `Sending ${item.from} NFT to ${item.toAddress}`,
        };
    },
    FAILED(item) {
        return {
            title: `${item.from} NFT Transaction Failed`,
            message: `Failed to send ${item.from} NFT to ${item.toAddress}`,
        };
    },
    SUCCESS(item) {
        return {
            title: `${item.from} NFT Transaction Confirmed`,
            message: `Sent ${item.from} NFT to ${item.toAddress}`,
        };
    },
};
const createNotification = (config) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return walletOptions_1.walletOptionsStore.walletOptions.createNotification(config); });
exports.createNotification = createNotification;
const createSwapNotification = (item) => {
    const swapProvider = (0, swap_1.getSwapProvider)(item.network, item.provider);
    const notificationFunction = swapProvider.statuses[item.status].notification;
    if (!notificationFunction)
        return;
    const notification = notificationFunction(item);
    return (0, exports.createNotification)(Object.assign({ title: `${item.from} -> ${item.to}` }, notification));
};
const createSendNotification = (item) => {
    if (!(item.status in SEND_STATUS_MAP))
        return;
    const notification = SEND_STATUS_MAP[item.status](item);
    return (0, exports.createNotification)(Object.assign({}, notification));
};
const createSendNFTNotification = (item) => {
    if (!(item.status in NFT_SEND_STATUS_MAP)) {
        return;
    }
    const notification = NFT_SEND_STATUS_MAP[item.status](item);
    return (0, exports.createNotification)(Object.assign({}, notification));
};
const createHistoryNotification = (item) => {
    if (item.type === 'SEND') {
        return createSendNotification(item);
    }
    else if (item.type === 'SWAP') {
        return createSwapNotification(item);
    }
    else if (item.type === 'NFT') {
        return createSendNFTNotification(item);
    }
};
exports.createHistoryNotification = createHistoryNotification;
//# sourceMappingURL=notification.js.map