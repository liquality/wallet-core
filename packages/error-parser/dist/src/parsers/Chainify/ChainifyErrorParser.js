"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainifyErrorParser = void 0;
const tslib_1 = require("tslib");
const ChainifyErrors = tslib_1.__importStar(require("@chainify/errors"));
const ErrorParser_1 = require("../ErrorParser");
const _1 = require(".");
const LiqualityErrors_1 = require("../../LiqualityErrors");
const LedgerErrorParser_1 = require("./LedgerErrorParser");
const factory_1 = require("../../factory");
const JsonRPCNodeErrorParser_1 = require("./JsonRPCNodeErrorParser");
const UniswapV2SwapErrorParser_1 = require("../UniswapV2/UniswapV2SwapErrorParser");
class ChainifyErrorParser extends ErrorParser_1.ErrorParser {
    _parseError(error, data) {
        let liqError;
        switch (error.name) {
            case ChainifyErrors.NodeError.prototype.name:
                if (error.message.includes('UniswapV2'))
                    return (0, factory_1.getErrorParser)(UniswapV2SwapErrorParser_1.UniswapV2SwapErroParser).parseError(error, null);
                return (0, factory_1.getErrorParser)(JsonRPCNodeErrorParser_1.JsonRPCNodeErrorParser).parseError(error, null);
            case ChainifyErrors.InvalidAddressError.prototype.name:
            case ChainifyErrors.InvalidDestinationAddressError.prototype.name:
            case ChainifyErrors.InvalidExpirationError.prototype.name:
            case ChainifyErrors.InvalidProviderError.prototype.name:
            case ChainifyErrors.InvalidProviderResponseError.prototype.name:
            case ChainifyErrors.InvalidSwapParamsError.prototype.name:
            case ChainifyErrors.InvalidValueError.prototype.name:
            case ChainifyErrors.BlockNotFoundError.prototype.name:
            case ChainifyErrors.TxNotFoundError.prototype.name:
            case ChainifyErrors.TxFailedError.prototype.name:
            case ChainifyErrors.PendingTxError.prototype.name:
            case ChainifyErrors.NoProviderError.prototype.name:
            case ChainifyErrors.ProviderNotFoundError.prototype.name:
            case ChainifyErrors.DuplicateProviderError.prototype.name:
            case ChainifyErrors.StandardError.prototype.name:
            case ChainifyErrors.UnimplementedMethodError.prototype.name:
            case ChainifyErrors.UnsupportedMethodError.prototype.name:
                liqError = new LiqualityErrors_1.InternalError();
                break;
            case ChainifyErrors.WalletError.prototype.name:
                if (error.message.startsWith('Ledger device:') ||
                    error.message.startsWith('EthAppPleaseEnableContractData') ||
                    error.message.includes('Invalid data received')) {
                    return (0, factory_1.getErrorParser)(LedgerErrorParser_1.LedgerErrorParser).parseError(error, null);
                }
                liqError = new LiqualityErrors_1.InternalError();
                break;
            case ChainifyErrors.ReplaceFeeInsufficientError.prototype.name:
                liqError = new LiqualityErrors_1.LowSpeedupFeeError();
                break;
            default:
                liqError = new LiqualityErrors_1.UnknownError();
                break;
        }
        liqError.source = ChainifyErrorParser.errorSource;
        liqError.devMsg = { desc: '', data: data || {} };
        liqError.rawError = error;
        return liqError;
    }
}
exports.ChainifyErrorParser = ChainifyErrorParser;
ChainifyErrorParser.errorSource = _1.ChainifyErrorSource;
//# sourceMappingURL=ChainifyErrorParser.js.map