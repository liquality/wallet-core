"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSwapTimeline = exports.ACTIONS_TERMS = exports.TimelineAction = exports.TimelineSide = void 0;
const tslib_1 = require("tslib");
const factory_1 = require("../factory");
const asset_1 = require("./asset");
const history_1 = require("./history");
var TimelineSide;
(function (TimelineSide) {
    TimelineSide["RIGHT"] = "right";
    TimelineSide["LEFT"] = "left";
})(TimelineSide = exports.TimelineSide || (exports.TimelineSide = {}));
var TimelineAction;
(function (TimelineAction) {
    TimelineAction["LOCK"] = "lock";
    TimelineAction["CLAIM"] = "claim";
    TimelineAction["REFUND"] = "refund";
    TimelineAction["RECEIVE"] = "receive";
    TimelineAction["APPROVE"] = "approve";
    TimelineAction["SWAP"] = "swap";
})(TimelineAction = exports.TimelineAction || (exports.TimelineAction = {}));
exports.ACTIONS_TERMS = {
    [TimelineAction.LOCK]: {
        default: 'Lock',
        pending: 'Locking',
        completed: 'Locked',
        failed: 'Failed Locking',
    },
    [TimelineAction.CLAIM]: {
        default: 'Claim',
        pending: 'Claiming',
        completed: 'Claimed',
        failed: 'Failed Claiming',
    },
    [TimelineAction.APPROVE]: {
        default: 'Approve Not Required',
        pending: 'Approving',
        completed: 'Approved',
        failed: 'Failed Approving',
    },
    [TimelineAction.RECEIVE]: {
        default: 'Receive',
        pending: 'Receiving',
        completed: 'Received',
        failed: 'Failed Receiving',
    },
    [TimelineAction.SWAP]: {
        default: 'Collect',
        pending: 'Collecting',
        completed: 'Collected',
        failed: 'Failed Collecting',
    },
    [TimelineAction.REFUND]: {
        default: 'Refund',
        pending: 'Refunding',
        completed: 'Refunded',
        failed: 'Failed Refunding',
    },
};
function getSwapTimeline(item, getClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        function getToAssetWhenSwappingFromNative() {
            if (item.provider.includes('liqualityBoost') && !(0, asset_1.isERC20)(item.from)) {
                return item.bridgeAsset;
            }
            return item.to;
        }
        function getFromAssetWhenSwappingFromERC20() {
            if (item.provider.includes('liqualityBoost') && (0, asset_1.isERC20)(item.from)) {
                return item.bridgeAsset;
            }
            return item.from;
        }
        function getTransaction(hash, asset, defaultTx) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const client = getClient({
                    network: item.network,
                    walletId: item.walletId,
                    asset,
                });
                const transaction = (yield client.chain.getTransactionByHash(hash)) || defaultTx;
                const timelineTransacstion = Object.assign(Object.assign({}, transaction), { explorerLink: (0, asset_1.getTransactionExplorerLink)(hash, asset, item.network), asset });
                return timelineTransacstion;
            });
        }
        function getTransactionStep(completed, pending, side, hash, defaultTx, asset, action) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const step = {
                    side,
                    pending,
                    completed,
                    title: pending ? `${exports.ACTIONS_TERMS[action].pending} ${asset}` : `${exports.ACTIONS_TERMS[action].default} ${asset}`,
                };
                if (hash) {
                    const tx = yield getTransaction(hash, asset, defaultTx);
                    if (tx && tx.confirmations && tx.confirmations > 0) {
                        if (tx.status === 'FAILED') {
                            step.title = `${exports.ACTIONS_TERMS[action].failed} ${asset}`;
                        }
                        else {
                            step.title = `${exports.ACTIONS_TERMS[action].completed} ${asset}`;
                        }
                    }
                    else {
                        step.title = `${exports.ACTIONS_TERMS[action].pending} ${asset}`;
                    }
                    step.tx = tx || { hash: hash };
                }
                return step;
            });
        }
        function getInitiationStep(completed, pending, side) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return getTransactionStep(completed, pending, side, item.fromFundHash, item.fromFundTx, getFromAssetWhenSwappingFromERC20(), TimelineAction.LOCK);
            });
        }
        function getAgentInitiationStep(completed, pending, side) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return getTransactionStep(completed, pending, side, item.toFundHash, null, getToAssetWhenSwappingFromNative(), TimelineAction.LOCK);
            });
        }
        function getClaimRefundStep(completed, pending, side) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return item.refundHash
                    ? getTransactionStep(completed, pending, side, item.refundHash, item.refundTx, item.from, TimelineAction.REFUND)
                    : getTransactionStep(completed, pending, side, item.toClaimHash, item.toClaimTx, getToAssetWhenSwappingFromNative(), TimelineAction.CLAIM);
            });
        }
        function getApproveStep(completed, pending, side) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return getTransactionStep(completed, pending, side, item.approveTxHash, null, item.from, TimelineAction.APPROVE);
            });
        }
        function getSwapStep(completed, pending, side) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return item.refundHash
                    ? {
                        side: TimelineSide.RIGHT,
                        pending: false,
                        completed: true,
                        title: `${exports.ACTIONS_TERMS.swap.pending} ${item.to} Interrupted`,
                    }
                    : getTransactionStep(completed, pending, side, item.swapTxHash, item.swapTx, getFromAssetWhenSwappingFromERC20(), TimelineAction.SWAP);
            });
        }
        function getReceiveStep(completed, pending, side) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return item.status === 'REFUNDED'
                    ? getTransactionStep(completed, pending, side, item.receiveTxHash, null, item.from, TimelineAction.REFUND)
                    : getTransactionStep(completed, pending, side, item.receiveTxHash, null, item.to, TimelineAction.RECEIVE);
            });
        }
        const timeline = [];
        const supportedSteps = {
            SWAP: getSwapStep,
            APPROVE: getApproveStep,
            RECEIVE: getReceiveStep,
            INITIATION: getInitiationStep,
            AGENT_INITIATION: getAgentInitiationStep,
            CLAIM_OR_REFUND: getClaimRefundStep,
        };
        const swapProvider = (0, factory_1.getSwapProvider)(item.network, item.provider);
        const timelineDiagramSteps = swapProvider.timelineDiagramSteps;
        const steps = timelineDiagramSteps.map((step) => supportedSteps[step]);
        for (let i = 0; i < steps.length; i++) {
            const completed = (0, history_1.getStep)(item) > i;
            const pending = (0, history_1.getStep)(item) === i;
            const side = i % 2 === 0 ? TimelineSide.LEFT : TimelineSide.RIGHT;
            const step = yield steps[i](completed, pending, side);
            timeline.push(step);
        }
        return timeline;
    });
}
exports.getSwapTimeline = getSwapTimeline;
//# sourceMappingURL=timeline.js.map