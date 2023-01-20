"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifiQuoteErrorParser = void 0;
const LiqualityError_1 = require("../../LiqualityErrors/LiqualityError");
const ErrorParser_1 = require("../ErrorParser");
const _1 = require(".");
const LiqualityErrors_1 = require("../../LiqualityErrors");
const utils_1 = require("../../utils");
class LifiQuoteErrorParser extends ErrorParser_1.ErrorParser {
    _parseError(error, data) {
        let liqError;
        let devDesc = '';
        if ((0, utils_1.is1001ValidationError)(error)) {
            liqError = new LiqualityErrors_1.PairNotSupportedError();
        }
        else if (!error.message) {
            liqError = new LiqualityErrors_1.UnknownError();
        }
        else {
            const errorDesc = error === null || error === void 0 ? void 0 : error.message;
            switch (true) {
                case _1.LIFI_QUOTE_ERRORS.UnknownAddressOrSymbol.test(errorDesc):
                case _1.LIFI_QUOTE_ERRORS.InvalidAddress.test(errorDesc):
                case _1.LIFI_QUOTE_ERRORS.InvalidChain.test(errorDesc):
                    devDesc = _1.LIFI_ERROR_REASON.IncorrectInputs;
                    liqError = new LiqualityErrors_1.InternalError();
                    break;
                case _1.LIFI_QUOTE_ERRORS.NoToolsCanCompleteTheAction.test(errorDesc):
                    liqError = new LiqualityErrors_1.PairNotSupportedError();
                    break;
                case _1.LIFI_QUOTE_ERRORS.NoQuoteFound.test(errorDesc): {
                    const errorCodes = error.errors.map((toolError) => toolError.code);
                    switch (true) {
                        case errorCodes.includes(_1.ToolErrorCode.AMOUNT_TOO_LOW):
                        case errorCodes.includes(_1.ToolErrorCode.FEES_HGHER_THAN_AMOUNT):
                            liqError = new LiqualityErrors_1.InsufficientInputAmountError();
                            break;
                        case errorCodes.includes(_1.ToolErrorCode.AMOUNT_TOO_HIGH):
                            liqError = new LiqualityErrors_1.HighInputAmountError();
                            break;
                        case errorCodes.includes(_1.ToolErrorCode.INSUFFICIENT_LIQUIDITY):
                            liqError = new LiqualityErrors_1.InsufficientLiquidityError({
                                from: data.fromToken,
                                to: data.toToken,
                                amount: data.fromAmount,
                            });
                            break;
                        case errorCodes.includes(_1.ToolErrorCode.TOOL_TIMEOUT):
                        case errorCodes.includes(_1.ToolErrorCode.RPC_ERROR):
                            liqError = new LiqualityErrors_1.ThirdPartyError({ activity: LiqualityError_1.UserActivity.SWAP });
                            break;
                        default:
                            devDesc = _1.LIFI_ERROR_REASON.LifiSubServicesFailed;
                            liqError = new LiqualityErrors_1.UnknownError();
                            break;
                    }
                    break;
                }
                default:
                    liqError = new LiqualityErrors_1.UnknownError();
                    break;
            }
        }
        liqError.source = LifiQuoteErrorParser.errorSource;
        liqError.devMsg = { desc: devDesc, data };
        liqError.rawError = error;
        return liqError;
    }
}
exports.LifiQuoteErrorParser = LifiQuoteErrorParser;
LifiQuoteErrorParser.errorSource = _1.lifiQuoteErrorSource;
//# sourceMappingURL=QuoteErrorParser.js.map