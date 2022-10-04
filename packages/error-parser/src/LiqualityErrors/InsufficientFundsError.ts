import { UserErrorMessage } from 'src/types/types';
import { LiqualityError } from '.';

class InsufficientFundsError extends LiqualityError<InsufficientFundsErrorContext> {
  public readonly name = 'InsufficientFundsError';

  constructor(context: InsufficientFundsErrorContext) {
    super(context);
  }

  wrapUserErrorMessage(lang?: string): UserErrorMessage {
    const { availAmt, currency, neededAmt } = this.context;
    switch (lang) {
      default:
        this.userMsg = {
          cause: `Insufficient funds: Sorry, You have ${availAmt}${currency} but you need ${neededAmt}${currency} `,
          suggestions: [],
        };
    }

    return this.userMsg;
  }
}

export type InsufficientFundsErrorContext = { availAmt: string; neededAmt: string; currency: string };
export default InsufficientFundsError;
