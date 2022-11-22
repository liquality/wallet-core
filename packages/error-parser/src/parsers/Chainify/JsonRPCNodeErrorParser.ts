/* eslint-disable @typescript-eslint/no-explicit-any */

import { InsufficientGasFeeError, LiqualityError, UnknownError } from '../../LiqualityErrors';
import { JSON_RPC_NODE_ERRORS, JSON_RPC_NODE_ERROR_SOURCE_NAME } from '.';
import { ErrorParser } from '../ErrorParser';

export class JsonRPCNodeErrorParser extends ErrorParser<Error, NodeParserDataType> {
  public static readonly errorSource = JSON_RPC_NODE_ERROR_SOURCE_NAME;

  protected _parseError(error: Error): LiqualityError {
    let liqError: LiqualityError;
    switch (true) {
      case error.message.includes(JSON_RPC_NODE_ERRORS.INSUFFICIENT_GAS_PRICE_RSK):
        liqError = new InsufficientGasFeeError();
        break;
      default:
        liqError = new UnknownError();
        break;
    }

    liqError.source = JsonRPCNodeErrorParser.errorSource;
    liqError.devMsg = {
      desc: 'See (https://www.jsonrpc.org/specification)',
      data: {},
    };
    liqError.rawError = error;

    return liqError;
  }
}

export type NodeParserDataType = null;
