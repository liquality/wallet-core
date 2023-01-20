"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniswapV2SwapErroParser = void 0;
const LiqualityErrors_1 = require("../../LiqualityErrors");
const _1 = require(".");
const ErrorParser_1 = require("../ErrorParser");
const ValidationError_1 = require("../../LiqualityErrors/ValidationError");
class UniswapV2SwapErroParser extends ErrorParser_1.ErrorParser {
    _parseError(error, data) {
        let liqError;
        let desc = '';
        switch (true) {
            case error.message.includes(_1.UNISWAP_V2_ERRORS.UNSUPPORTED_SWAP_METHOD_FOR_TOKEN_TYPE):
                liqError = new ValidationError_1.ValidationError();
                desc =
                    'This is happening because the token involved in the swap is an FOT(fee on transfer) token. the supportingFeeOnTransfer token group of methods should be used. (See https://github.com/Uniswap/interface/issues/835)';
                break;
            default:
                liqError = new LiqualityErrors_1.UnknownError();
                break;
        }
        liqError.source = UniswapV2SwapErroParser.errorSource;
        liqError.devMsg = {
            desc,
            data: data || {},
        };
        liqError.rawError = error;
        return liqError;
    }
}
exports.UniswapV2SwapErroParser = UniswapV2SwapErroParser;
UniswapV2SwapErroParser.errorSource = _1.UNISWAP_V2_ERROR_SOURCE_NAME;
//# sourceMappingURL=UniswapV2SwapErrorParser.js.map