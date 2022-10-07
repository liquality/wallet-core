import { LiqualityError } from '.';
class InsufficientFundsError extends LiqualityError<InsufficientFundsErrorContext> {
  public readonly name = 'InsufficientFundsError';

  constructor(data?: InsufficientFundsErrorContext) {
    super(data);
  }
}

export type InsufficientFundsErrorContext = { availAmt: string; neededAmt: string; currency: string };
export default InsufficientFundsError;
