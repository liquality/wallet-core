import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';

export class InsufficientInputAmountError extends LiqualityError<InsufficientInputAmountErrorContext> {
  constructor(data?: InsufficientInputAmountErrorContext) {
    super(ERROR_NAMES.InsufficientInputAmountError, data);
  }
}

export type InsufficientInputAmountErrorContext = { expectedMinimum: string; assetCode: string };
