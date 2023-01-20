export declare const oneInchQuoteErrorSource = "OneInchQuoteAPI";
export declare const oneInchSwapSourceName = "OneInchSwapAPI";
export declare const oneInchApproveSourceName = "OneInchApproveAPI";
export declare type OneInchError = {
    statusCode: number;
    error: string;
    description: string;
    requestId: string;
    meta: {
        type: string;
        value: string;
    }[];
    name: string;
};
export declare const ONE_INCH_ERRORS: {
    INSUFFICIENT_LIQUIDITY: RegExp;
    CANNOT_ESTIMATE_1: RegExp;
    CANNOT_ESTIMATE_WITH_REASON: RegExp;
    INSUFFICIENT_GAS_FEE: RegExp;
    INVALID_TOKEN_PAIR: RegExp;
    INVALID_TOKEN_ADDRESS: RegExp;
    INSUFFICIENT_FUNDS: RegExp;
    INSUFFICIENT_ALLOWANCE: RegExp;
    INTERNAL_ERROR: RegExp;
};
export declare function oneInchInternalErrReason(): string;
