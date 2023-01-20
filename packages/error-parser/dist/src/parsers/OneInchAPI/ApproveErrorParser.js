"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneInchApproveErrorParser = void 0;
const LiqualityError_1 = require("../../LiqualityErrors/LiqualityError");
const ErrorParser_1 = require("../ErrorParser");
const _1 = require(".");
const LiqualityErrors_1 = require("../../LiqualityErrors");
const utils_1 = require("../../utils");
class OneInchApproveErrorParser extends ErrorParser_1.ErrorParser {
    _parseError(error) {
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
                case _1.ONE_INCH_ERRORS.INTERNAL_ERROR.test(errorDesc):
                    liqError = new LiqualityErrors_1.ThirdPartyError({ activity: LiqualityError_1.UserActivity.SWAP });
                    devDesc = (0, _1.oneInchInternalErrReason)();
                    break;
                case _1.ONE_INCH_ERRORS.INVALID_TOKEN_ADDRESS.test(errorDesc):
                    liqError = new LiqualityErrors_1.InternalError();
                    break;
                default:
                    liqError = new LiqualityErrors_1.UnknownError();
                    break;
            }
        }
        liqError.source = OneInchApproveErrorParser.errorSource;
        liqError.devMsg = { desc: devDesc, data: {} };
        liqError.rawError = error;
        return liqError;
    }
}
exports.OneInchApproveErrorParser = OneInchApproveErrorParser;
OneInchApproveErrorParser.errorSource = _1.oneInchApproveSourceName;
//# sourceMappingURL=ApproveErrorParser.js.map