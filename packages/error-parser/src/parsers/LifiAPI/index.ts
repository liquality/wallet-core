export const lifiQuoteErrorSource = 'LifiQuoteAPI';

// errors from internal bridges and dexes
export enum ToolErrorCode {
  NO_POSSIBLE_ROUTE = 'NO_POSSIBLE_ROUTE', // No route was found for this action.
  INSUFFICIENT_LIQUIDITY = 'INSUFFICIENT_LIQUIDITY', // The tool's liquidity is insufficient.
  TOOL_TIMEOUT = 'TOOL_TIMEOUT', // The third-party tool timed out.
  UNKNOWN_ERROR = 'UNKNOWN_ERROR', // An unknown error occurred.
  RPC_ERROR = 'RPC_ERROR', // There was a problem getting on-chain data. Please try again later.
  AMOUNT_TOO_LOW = 'AMOUNT_TOO_LOW', // The initial amount is too low to transfer using this tool.
  AMOUNT_TOO_HIGH = 'AMOUNT_TOO_HIGH', // The initial amount is too high to transfer using this tool.
  FEES_HGHER_THAN_AMOUNT = 'FEES_HGHER_THAN_AMOUNT', // The fees are higher than the initial amount -- this would result in negative resulting token.
  DIFFERENT_RECIPIENT_NOT_SUPPORTED = 'DIFFERENT_RECIPIENT_NOT_SUPPORTED', // This tool does not support different recipient addresses.
  TOOL_SPECIFIC_ERROR = 'TOOL_SPECIFIC_ERROR', // The third-party tool returned an error.
  CANNOT_GUARANTEE_MIN_AMOUNT = 'CANNOT_GUARANTEE_MIN_AMOUNT', // The tool cannot guarantee that the minimum amount will be met.
}

// expected default error
export enum ErrorType {
  NO_QUOTE = 'NO_QUOTE',
}

type ToolError = {
  errorType?: ErrorType;
  code: ToolErrorCode;
  action?: any; // so far actions do not give a clear explanation of errors, so ignore them.
  tool?: string;
  message?: string;
};

export type LifiQuoteError = {
  message: string;
  errors: ToolError[];
};

// error message regex
export const LIFI_QUOTE_ERRORS = {
  NoToolsCanCompleteTheAction: /None of the allowed tools can complete this action/i,
  NoQuoteFound: /Unable to find a quote for the requested transfer/i,
  InvalidChain: /Invalid chainId .* passed/i, // eg. "Invalid chainId \"100000\" passed"
  UnknownAddressOrSymbol: /Unknown token symbol or address passed/i,
  InvalidAddress: /Invalid (from|to)Adress/i, // eg. "Invalid fromAdress: 0x"
};

export const LIFI_ERROR_REASON = {
  IncorrectInputs: 'Check getQuote input',
  LifiSubServicesFailed: 'All Lifi subservices failed',
};

export type LifiQuoteErrorParserDataType = {
  fromToken: string;
  toToken: string;
  fromAmount: string;
};
