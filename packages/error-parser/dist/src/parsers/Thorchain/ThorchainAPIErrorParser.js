"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThorchainAPIErrorParser = void 0;
const LiqualityErrors_1 = require("../../LiqualityErrors");
const _1 = require(".");
const ErrorParser_1 = require("../ErrorParser");
class ThorchainAPIErrorParser extends ErrorParser_1.ErrorParser {
    _parseError(error, data) {
        let liqError;
        let desc = '';
        switch (error.message) {
            case _1.THORCHAIN_ERRORS.NETWORK_ERROR:
                liqError = new LiqualityErrors_1.ThirdPartyError();
                desc = 'Thorchain seems to be down. Try contacting their support to ask why';
                break;
            default:
                liqError = new LiqualityErrors_1.UnknownError();
                break;
        }
        liqError.source = ThorchainAPIErrorParser.errorSource;
        liqError.devMsg = {
            desc,
            data: data || {},
        };
        liqError.rawError = error;
        return liqError;
    }
}
exports.ThorchainAPIErrorParser = ThorchainAPIErrorParser;
ThorchainAPIErrorParser.errorSource = _1.THORCHAIN_ERROR_SOURCE_NAME;
//# sourceMappingURL=ThorchainAPIErrorParser.js.map