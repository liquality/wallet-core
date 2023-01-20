"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneInchSwapErrorParser = void 0;
const LiqualityError_1 = require("../../LiqualityErrors/LiqualityError");
const ErrorParser_1 = require("../ErrorParser");
const _1 = require(".");
const LiqualityErrors_1 = require("../../LiqualityErrors");
const utils_1 = require("../../utils");
class OneInchSwapErrorParser extends ErrorParser_1.ErrorParser {
    _parseError(error, data) {
        let liqError;
        let devDesc = '';
        if ((0, utils_1.is1001ValidationError)(error) || (0, utils_1.is1006NotFoundError)(error)) {
            liqError = new LiqualityErrors_1.PairNotSupportedError();
        }
        else if ((error === null || error === void 0 ? void 0 : error.name) !== 'NodeError') {
            liqError = new LiqualityErrors_1.UnknownError();
        }
        else {
            const errorDesc = error === null || error === void 0 ? void 0 : error.description;
            switch (true) {
                case _1.ONE_INCH_ERRORS.INSUFFICIENT_LIQUIDITY.test(errorDesc):
                    liqError = new LiqualityErrors_1.InsufficientLiquidityError({ from: data.from, to: data.to, amount: data.amount });
                    break;
                case _1.ONE_INCH_ERRORS.CANNOT_ESTIMATE_1.test(errorDesc):
                    liqError = new LiqualityErrors_1.ThirdPartyError({ activity: LiqualityError_1.UserActivity.SWAP });
                    devDesc = 'see https://bit.ly/3Bu3e7U';
                    break;
                case _1.ONE_INCH_ERRORS.INSUFFICIENT_GAS_FEE.test(errorDesc):
                    liqError = new LiqualityErrors_1.InsufficientGasFeeError();
                    break;
                case _1.ONE_INCH_ERRORS.INVALID_TOKEN_ADDRESS.test(errorDesc):
                    liqError = new LiqualityErrors_1.InternalError();
                    break;
                case _1.ONE_INCH_ERRORS.INVALID_TOKEN_PAIR.test(errorDesc):
                    liqError = new LiqualityErrors_1.InternalError();
                    break;
                case _1.ONE_INCH_ERRORS.CANNOT_ESTIMATE_WITH_REASON.test(errorDesc):
                    liqError = new LiqualityErrors_1.ThirdPartyError({ activity: LiqualityError_1.UserActivity.SWAP });
                    devDesc = 'see https://bit.ly/3Bu3e7U';
                    break;
                case _1.ONE_INCH_ERRORS.INSUFFICIENT_FUNDS.test(errorDesc):
                    liqError = new LiqualityErrors_1.InsufficientFundsError({
                        currency: data.from,
                        availAmt: data.balance,
                        neededAmt: data.amount,
                    });
                    break;
                case _1.ONE_INCH_ERRORS.INSUFFICIENT_ALLOWANCE.test(errorDesc):
                    liqError = new LiqualityErrors_1.InternalError();
                    devDesc = 'Check the approval process for 1inch, approvals are not being made correctly';
                    break;
                case _1.ONE_INCH_ERRORS.INTERNAL_ERROR.test(errorDesc):
                    liqError = new LiqualityErrors_1.ThirdPartyError({ activity: LiqualityError_1.UserActivity.SWAP });
                    devDesc = (0, _1.oneInchInternalErrReason)();
                    break;
                default:
                    liqError = new LiqualityErrors_1.UnknownError();
                    break;
            }
        }
        liqError.source = OneInchSwapErrorParser.errorSource;
        liqError.devMsg = { desc: devDesc, data };
        liqError.rawError = error;
        return liqError;
    }
}
exports.OneInchSwapErrorParser = OneInchSwapErrorParser;
OneInchSwapErrorParser.errorSource = _1.oneInchSwapSourceName;
//# sourceMappingURL=SwapErrorParser.js.map