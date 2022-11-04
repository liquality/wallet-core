import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class InsufficientGasFeeError extends LiqualityError<InsufficientGasFeeErrorContext> {
  constructor(data?: InsufficientGasFeeErrorContext) {
    super(ERROR_NAMES.InsufficientGasFeeError, data);
  }
}

export type InsufficientGasFeeErrorContext = { currency: string; gasFee: string };
