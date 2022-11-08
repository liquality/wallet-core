import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class VeryLowMaxFeeError extends LiqualityError<VeryLowMaxFeeErrorContext> {
  constructor(data?: VeryLowMaxFeeErrorContext) {
    super(ERROR_NAMES.VeryLowMaxFeeError, data);
  }
}

export type VeryLowMaxFeeErrorContext = { maxFeePerGas: string };
