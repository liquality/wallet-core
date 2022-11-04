import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class InsufficientFundsError extends LiqualityError<InsufficientFundsErrorContext> {
  constructor(data?: InsufficientFundsErrorContext) {
    super(ERROR_NAMES.InsufficientFundsError, data);
  }
}

export type InsufficientFundsErrorContext = { availAmt: string; neededAmt: string; currency: string };
