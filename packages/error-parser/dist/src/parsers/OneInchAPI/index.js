"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneInchInternalErrReason = exports.ONE_INCH_ERRORS = exports.oneInchApproveSourceName = exports.oneInchSwapSourceName = exports.oneInchQuoteErrorSource = void 0;
exports.oneInchQuoteErrorSource = 'OneInchQuoteAPI';
exports.oneInchSwapSourceName = 'OneInchSwapAPI';
exports.oneInchApproveSourceName = 'OneInchApproveAPI';
exports.ONE_INCH_ERRORS = {
    INSUFFICIENT_LIQUIDITY: /Insufficient liquidity/i,
    CANNOT_ESTIMATE_1: /Cannot estimate/i,
    CANNOT_ESTIMATE_WITH_REASON: /Cannot estimate. Don't forget about miner fee. Try to leave the buffer of ETH for gas/i,
    INSUFFICIENT_GAS_FEE: /You may not have enough ETH balance for gas fee/i,
    INVALID_TOKEN_PAIR: /FromTokenAddress cannot be equals to toTokenAddress/i,
    INVALID_TOKEN_ADDRESS: /\S* is wrong address/i,
    INSUFFICIENT_FUNDS: /Not enough \S* balance/i,
    INSUFFICIENT_ALLOWANCE: /Not enough \S* allowance/i,
    INTERNAL_ERROR: /Internal Server Error/i,
};
function oneInchInternalErrReason() {
    return 'This could be due to invalid data, for example providing a string for amount instead of a number';
}
exports.oneInchInternalErrReason = oneInchInternalErrReason;
//# sourceMappingURL=index.js.map