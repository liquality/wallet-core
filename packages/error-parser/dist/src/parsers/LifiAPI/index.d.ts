export declare const lifiQuoteErrorSource = "LifiQuoteAPI";
export declare enum ToolErrorCode {
    NO_POSSIBLE_ROUTE = "NO_POSSIBLE_ROUTE",
    INSUFFICIENT_LIQUIDITY = "INSUFFICIENT_LIQUIDITY",
    TOOL_TIMEOUT = "TOOL_TIMEOUT",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
    RPC_ERROR = "RPC_ERROR",
    AMOUNT_TOO_LOW = "AMOUNT_TOO_LOW",
    AMOUNT_TOO_HIGH = "AMOUNT_TOO_HIGH",
    FEES_HGHER_THAN_AMOUNT = "FEES_HGHER_THAN_AMOUNT",
    DIFFERENT_RECIPIENT_NOT_SUPPORTED = "DIFFERENT_RECIPIENT_NOT_SUPPORTED",
    TOOL_SPECIFIC_ERROR = "TOOL_SPECIFIC_ERROR",
    CANNOT_GUARANTEE_MIN_AMOUNT = "CANNOT_GUARANTEE_MIN_AMOUNT"
}
export declare enum ErrorType {
    NO_QUOTE = "NO_QUOTE"
}
declare type ToolError = {
    errorType?: ErrorType;
    code: ToolErrorCode;
    action?: any;
    tool?: string;
    message?: string;
};
export declare type LifiQuoteError = {
    message: string;
    errors: ToolError[];
};
export declare const LIFI_QUOTE_ERRORS: {
    NoToolsCanCompleteTheAction: RegExp;
    NoQuoteFound: RegExp;
    InvalidChain: RegExp;
    UnknownAddressOrSymbol: RegExp;
    InvalidAddress: RegExp;
};
export declare const LIFI_ERROR_REASON: {
    IncorrectInputs: string;
    LifiSubServicesFailed: string;
};
export declare type LifiQuoteErrorParserDataType = {
    fromToken: string;
    toToken: string;
    fromAmount: string;
};
export {};
