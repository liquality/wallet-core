"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebridgeAPIErrorParser = void 0;
const LiqualityErrors_1 = require("../../LiqualityErrors");
const _1 = require(".");
const ErrorParser_1 = require("../ErrorParser");
class DebridgeAPIErrorParser extends ErrorParser_1.ErrorParser {
    _parseError(error) {
        let liqError;
        let desc = '';
        switch (error.errorId) {
            case _1.DEBRIDGE_ERRORS.INVALID_QUERY_PARAMETERS:
                liqError = new LiqualityErrors_1.InternalError();
                break;
            case _1.DEBRIDGE_ERRORS.SOURCE_AND_DESTINATION_CHAINS_ARE_EQUAL:
                liqError = new LiqualityErrors_1.PairNotSupportedError();
                break;
            case _1.DEBRIDGE_ERRORS.INCLUDED_GAS_FEE_NOT_COVERED_BY_INPUT_AMOUNT:
                liqError = new LiqualityErrors_1.InsufficientInputAmountError();
                desc =
                    'see https://docs.debridge.finance/build-with-debridge/getting-started#:~:text=to%20understand%20each.-,executionFee,-(or%20included%20gas';
                break;
            case _1.DEBRIDGE_ERRORS.INCLUDED_GAS_FEE_CANNOT_BE_ESTIMATED_FOR_TRANSACTION_BUNDLE:
                liqError = new LiqualityErrors_1.InternalError();
                desc =
                    "Perhaps 'dstBaseGasAmount' param is not set. See https://deswap.debridge.finance/v1.0/#/deSwap/AppControllerV10_getTransaction:~:text=Amount%20of%20gas,our%20backend%20server";
                break;
            case _1.DEBRIDGE_ERRORS.CONNECTOR_1INCH_RETURNED_ERROR:
            case _1.DEBRIDGE_ERRORS.INTERNAL_SERVER_ERROR:
            case _1.DEBRIDGE_ERRORS.INTERNAL_SDK_ERROR:
                liqError = new LiqualityErrors_1.ThirdPartyError();
                break;
            default:
                liqError = new LiqualityErrors_1.UnknownError();
                break;
        }
        liqError.source = DebridgeAPIErrorParser.errorSource;
        liqError.devMsg = {
            desc,
            data: {},
        };
        liqError.rawError = error;
        return liqError;
    }
}
exports.DebridgeAPIErrorParser = DebridgeAPIErrorParser;
DebridgeAPIErrorParser.errorSource = _1.DEBRIDGE_ERROR_SOURCE_NAME;
//# sourceMappingURL=DebridgeAPIErrorParser.js.map