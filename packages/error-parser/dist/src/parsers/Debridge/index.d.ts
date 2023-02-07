export declare const DEBRIDGE_ERROR_SOURCE_NAME = "Debridge API";
export declare const DEBRIDGE_ERRORS: {
    INVALID_QUERY_PARAMETERS: string;
    SOURCE_AND_DESTINATION_CHAINS_ARE_EQUAL: string;
    INCLUDED_GAS_FEE_NOT_COVERED_BY_INPUT_AMOUNT: string;
    INCLUDED_GAS_FEE_CANNOT_BE_ESTIMATED_FOR_TRANSACTION_BUNDLE: string;
    CONNECTOR_1INCH_RETURNED_ERROR: string;
    INTERNAL_SERVER_ERROR: string;
    INTERNAL_SDK_ERROR: string;
};
export declare type DebridgeError = {
    errorCode: number;
    errorId: string;
    errorMessage: string;
    errorPayload: any;
};
