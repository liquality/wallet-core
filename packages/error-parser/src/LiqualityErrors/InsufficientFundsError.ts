import { LiqualityError } from '.';
import { ErrorType } from '../types/types';

class InsufficientFundsError extends LiqualityError {
  constructor(context?: InsufficientFundsErrorContext, lang?: string) {
    super();
    if (context) {
      this.wrapUserErrorMessage(context, lang);
    }
  }

  wrapUserErrorMessage(context: InsufficientFundsErrorContext, lang?: string): void {
    const { availAmt, currency, neededAmt } = context;
    switch (lang) {
      default:
        this.userMsg = {
          cause: `Insufficient funds: Sorry, You have ${availAmt}${currency} but you need ${neededAmt}${currency} `,
          suggestions: [],
        };
        break;
    }
  }
}

InsufficientFundsError.prototype.name = ErrorType.InsufficientFundsError;

export type InsufficientFundsErrorContext = { availAmt: string; neededAmt: string; currency: string };
export default InsufficientFundsError;
