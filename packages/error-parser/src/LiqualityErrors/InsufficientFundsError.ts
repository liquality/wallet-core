import { LiqualityError } from '.';

class InsufficientFundsError extends LiqualityError {
  public readonly name = 'InsufficientFundsError';

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

export type InsufficientFundsErrorContext = { availAmt: string; neededAmt: string; currency: string };
export default InsufficientFundsError;
