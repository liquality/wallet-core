"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIFI_ERROR_REASON = exports.LIFI_QUOTE_ERRORS = exports.ErrorType = exports.ToolErrorCode = exports.lifiQuoteErrorSource = void 0;
exports.lifiQuoteErrorSource = 'LifiQuoteAPI';
var ToolErrorCode;
(function (ToolErrorCode) {
    ToolErrorCode["NO_POSSIBLE_ROUTE"] = "NO_POSSIBLE_ROUTE";
    ToolErrorCode["INSUFFICIENT_LIQUIDITY"] = "INSUFFICIENT_LIQUIDITY";
    ToolErrorCode["TOOL_TIMEOUT"] = "TOOL_TIMEOUT";
    ToolErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
    ToolErrorCode["RPC_ERROR"] = "RPC_ERROR";
    ToolErrorCode["AMOUNT_TOO_LOW"] = "AMOUNT_TOO_LOW";
    ToolErrorCode["AMOUNT_TOO_HIGH"] = "AMOUNT_TOO_HIGH";
    ToolErrorCode["FEES_HGHER_THAN_AMOUNT"] = "FEES_HGHER_THAN_AMOUNT";
    ToolErrorCode["DIFFERENT_RECIPIENT_NOT_SUPPORTED"] = "DIFFERENT_RECIPIENT_NOT_SUPPORTED";
    ToolErrorCode["TOOL_SPECIFIC_ERROR"] = "TOOL_SPECIFIC_ERROR";
    ToolErrorCode["CANNOT_GUARANTEE_MIN_AMOUNT"] = "CANNOT_GUARANTEE_MIN_AMOUNT";
})(ToolErrorCode = exports.ToolErrorCode || (exports.ToolErrorCode = {}));
var ErrorType;
(function (ErrorType) {
    ErrorType["NO_QUOTE"] = "NO_QUOTE";
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
exports.LIFI_QUOTE_ERRORS = {
    NoToolsCanCompleteTheAction: /None of the allowed tools can complete this action/i,
    NoQuoteFound: /Unable to find a quote for the requested transfer/i,
    InvalidChain: /Invalid chainId .* passed/i,
    UnknownAddressOrSymbol: /Unknown token symbol or address passed/i,
    InvalidAddress: /Invalid (from|to)Adress/i,
};
exports.LIFI_ERROR_REASON = {
    IncorrectInputs: 'Check getQuote input',
    LifiSubServicesFailed: 'All Lifi subservices failed',
};
//# sourceMappingURL=index.js.map