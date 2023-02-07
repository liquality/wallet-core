"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRPCNodeErrorParser = void 0;
const LiqualityErrors_1 = require("../../LiqualityErrors");
const _1 = require(".");
const ErrorParser_1 = require("../ErrorParser");
class JsonRPCNodeErrorParser extends ErrorParser_1.ErrorParser {
    _parseError(error) {
        let liqError;
        switch (true) {
            case error.message.includes(_1.JSON_RPC_NODE_ERRORS.INSUFFICIENT_GAS_PRICE_RSK):
                liqError = new LiqualityErrors_1.InsufficientGasFeeError();
                break;
            default:
                liqError = new LiqualityErrors_1.UnknownError();
                break;
        }
        liqError.source = JsonRPCNodeErrorParser.errorSource;
        liqError.devMsg = {
            desc: 'See (https://www.jsonrpc.org/specification)',
            data: {},
        };
        liqError.rawError = error;
        return liqError;
    }
}
exports.JsonRPCNodeErrorParser = JsonRPCNodeErrorParser;
JsonRPCNodeErrorParser.errorSource = _1.JSON_RPC_NODE_ERROR_SOURCE_NAME;
//# sourceMappingURL=JsonRPCNodeErrorParser.js.map