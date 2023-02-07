"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerErrorParser = void 0;
const LiqualityErrors_1 = require("../../LiqualityErrors");
const _1 = require(".");
const ErrorParser_1 = require("../ErrorParser");
class LedgerErrorParser extends ErrorParser_1.ErrorParser {
    _parseError(error) {
        let liqError;
        switch (error.message) {
            case _1.LEDGER_ERRORS.APP_MISMATCH_ERROR:
            case _1.LEDGER_ERRORS.APP_NOT_SELECTED_ERROR:
                liqError = new LiqualityErrors_1.LedgerAppMismatchError();
                break;
            case _1.LEDGER_ERRORS.DAPP_CONFLICT_ERROR:
                liqError = new LiqualityErrors_1.LedgerDappConflictError();
                break;
            case _1.LEDGER_ERRORS.DEVICE_LOCKED_ERROR:
                liqError = new LiqualityErrors_1.LedgerDeviceLockedError();
                break;
            case _1.LEDGER_ERRORS.NOT_UPDATED_ERROR:
            case _1.LEDGER_ERRORS.INVALID_DATA_ERROR:
                liqError = new LiqualityErrors_1.LedgerDeviceNotUpdatedError();
                break;
            case _1.LEDGER_ERRORS.USER_REJECTED:
                liqError = new LiqualityErrors_1.UserDeclinedError();
                break;
            case _1.LEDGER_ERRORS.SMART_CONTRACT_INTERACTION_DISABLED:
                liqError = new LiqualityErrors_1.LedgerDeviceSmartContractTransactionDisabledError();
                break;
            default:
                liqError = new LiqualityErrors_1.UnknownError();
                break;
        }
        liqError.source = LedgerErrorParser.errorSource;
        liqError.devMsg = {
            desc: 'see (https://support.ledger.com/hc/en-us/articles/5789603823645-Ledger-MetaMask-common-error-messages?support=true) and (https://developerjesse.com/2022/01/18/ledger-error-codes.html)',
            data: {},
        };
        liqError.rawError = error;
        return liqError;
    }
}
exports.LedgerErrorParser = LedgerErrorParser;
LedgerErrorParser.errorSource = _1.LEDGER_ERROR_SOURCE_NAME;
//# sourceMappingURL=LedgerErrorParser.js.map