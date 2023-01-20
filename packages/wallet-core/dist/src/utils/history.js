"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyActivityFilters = exports.SEND_STATUS_FILTER_MAP = exports.ACTIVITY_STATUSES = exports.ACTIVITY_FILTER_TYPES = exports.getStep = exports.getStatusLabel = exports.SEND_STATUS_LABEL_MAP = exports.SEND_STATUS_STEP_MAP = void 0;
const tslib_1 = require("tslib");
const moment_1 = tslib_1.__importDefault(require("moment"));
const error_parser_1 = require("@liquality/error-parser");
const swap_1 = require("../factory/swap");
const types_1 = require("../store/types");
exports.SEND_STATUS_STEP_MAP = {
    [types_1.SendStatus.WAITING_FOR_CONFIRMATIONS]: 0,
    [types_1.SendStatus.SUCCESS]: 1,
    [types_1.SendStatus.FAILED]: 2,
};
exports.SEND_STATUS_LABEL_MAP = {
    [types_1.SendStatus.WAITING_FOR_CONFIRMATIONS]: 'Pending',
    [types_1.SendStatus.SUCCESS]: 'Completed',
    [types_1.SendStatus.FAILED]: 'Failed',
};
function getStatusLabel(item) {
    if (item.type === types_1.TransactionType.NFT) {
        return exports.SEND_STATUS_LABEL_MAP[item.status] || '';
    }
    if (item.type === types_1.TransactionType.Send) {
        return exports.SEND_STATUS_LABEL_MAP[item.status] || '';
    }
    if (item.type === types_1.TransactionType.Swap) {
        const swapProvider = (0, swap_1.getSwapProvider)(item.network, item.provider);
        return (swapProvider.statuses[item.status].label
            .replace('{from}', item.from)
            .replace('{to}', item.to)
            .replace('{bridgeAsset}', item.bridgeAsset || '') || '');
    }
}
exports.getStatusLabel = getStatusLabel;
function getStep(item) {
    const itemType = item.type;
    if (itemType === types_1.TransactionType.NFT) {
        return exports.SEND_STATUS_STEP_MAP[item.status];
    }
    if (itemType === types_1.TransactionType.Send) {
        return exports.SEND_STATUS_STEP_MAP[item.status];
    }
    if (itemType === types_1.TransactionType.Swap) {
        const swapProvider = (0, swap_1.getSwapProvider)(item.network, item.provider);
        return swapProvider.statuses[item.status].step;
    }
    throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.Invalid.TransactionType(itemType));
}
exports.getStep = getStep;
exports.ACTIVITY_FILTER_TYPES = {
    SWAP: {
        label: 'Swap',
        icon: 'swap',
    },
    NFT: {
        label: 'NFT',
        icon: 'nft',
    },
    SEND: {
        label: 'Send',
        icon: 'send',
    },
    RECEIVE: {
        label: 'Receive',
        icon: 'receive',
    },
};
exports.ACTIVITY_STATUSES = {
    PENDING: {
        label: 'Pending',
        icon: 'pending',
    },
    COMPLETED: {
        label: 'Completed',
        icon: 'completed',
    },
    FAILED: {
        label: 'Failed',
        icon: 'failed',
    },
    NEEDS_ATTENTION: {
        label: 'Needs Attention',
        icon: 'needs_attention',
    },
    REFUNDED: {
        label: 'Refunded',
        icon: 'refunded',
    },
};
exports.SEND_STATUS_FILTER_MAP = {
    WAITING_FOR_CONFIRMATIONS: 'PENDING',
    SUCCESS: 'COMPLETED',
    FAILED: 'FAILED',
};
const applyActivityFilters = (activity, filters) => {
    const { types, statuses, dates } = filters;
    let filteredByType = [...activity];
    if (types.length > 0) {
        filteredByType = [...filteredByType].filter((i) => types.includes(i.type));
    }
    let fiteredByStatus = [...filteredByType];
    if (statuses.length > 0) {
        fiteredByStatus = [...fiteredByStatus].filter((i) => {
            if (i.type === 'SWAP') {
                const swapProvider = (0, swap_1.getSwapProvider)(i.network, i.provider);
                return statuses.includes(swapProvider.statuses[i.status].filterStatus);
            }
            if (i.type === 'SEND') {
                return statuses.includes(exports.SEND_STATUS_FILTER_MAP[i.status]);
            }
            return true;
        });
    }
    let filteredByStartDate = [...fiteredByStatus];
    if (dates.start) {
        const startDateFilter = (0, moment_1.default)(dates.start);
        filteredByStartDate = [...filteredByStartDate].filter((i) => {
            const start = (0, moment_1.default)(i.startTime);
            const diffInDays = start.diff(startDateFilter, 'days');
            return diffInDays >= 0;
        });
    }
    let filteredByEndDate = [...filteredByStartDate];
    if (dates.end) {
        const endDateFilter = (0, moment_1.default)(dates.end);
        filteredByEndDate = [...filteredByEndDate].filter((i) => {
            const end = (0, moment_1.default)(i.startTime);
            const diffInDays = end.diff(endDateFilter, 'days');
            return diffInDays <= 0;
        });
    }
    return filteredByEndDate;
};
exports.applyActivityFilters = applyActivityFilters;
//# sourceMappingURL=history.js.map