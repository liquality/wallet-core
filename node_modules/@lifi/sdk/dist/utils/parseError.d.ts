import { Process, Step } from '@lifi/types';
import { LifiError } from './errors';
/**
 * Available MetaMask error codes:
 *
 * export const errorCodes: ErrorCodes = {
     rpc: {
      invalidInput: -32000,
      resourceNotFound: -32001,
      resourceUnavailable: -32002,
      transactionRejected: -32003,
      methodNotSupported: -32004,
      limitExceeded: -32005,
      parse: -32700,
      invalidRequest: -32600,
      methodNotFound: -32601,
      invalidParams: -32602,
      internal: -32603,
    },
    provider: {
      userRejectedRequest: 4001,
      unauthorized: 4100,
      unsupportedMethod: 4200,
      disconnected: 4900,
      chainDisconnected: 4901,
    },
  };
 *
 * For more information about error codes supported by metamask check
 * https://github.com/MetaMask/eth-rpc-errors
 * https://eips.ethereum.org/EIPS/eip-1474#error-codes
 * https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export declare const getTransactionNotSentMessage: (step?: Step, process?: Process) => Promise<string>;
export declare const getTransactionFailedMessage: (step: Step, txLink?: string) => string;
export declare const parseError: (e: any, step?: Step, process?: Process) => Promise<LifiError>;
export declare const parseBackendError: (e: any) => LifiError;
