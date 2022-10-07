import { LiqualityError } from '.';
export default class InsufficientFundsError extends LiqualityError<InsufficientFundsErrorContext> {
  public readonly name = InsufficientFundsError.name;

  constructor(data?: InsufficientFundsErrorContext) {
    super(data);
  }
}

export type InsufficientFundsErrorContext = { availAmt: string; neededAmt: string; currency: string };
