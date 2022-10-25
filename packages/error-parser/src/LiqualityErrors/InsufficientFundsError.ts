import { LiqualityError } from './LiqualityError';
export class InsufficientFundsError extends LiqualityError<InsufficientFundsErrorContext> {
  constructor(data?: InsufficientFundsErrorContext) {
    super(InsufficientFundsError.name, data);
  }
}

export type InsufficientFundsErrorContext = { availAmt: string; neededAmt: string; currency: string };
