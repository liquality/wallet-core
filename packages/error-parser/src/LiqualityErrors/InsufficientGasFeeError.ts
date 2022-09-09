import { LiqualityError } from '.';
class InsufficientGasFeeError extends LiqualityError {
  constructor(context?: InsufficientGasFeeErrorContext, lang?: string) {
    super();
    if (context) {
      this.wrapUserErrorMessage(context, lang);
    }
  }

  wrapUserErrorMessage(context: InsufficientGasFeeErrorContext, lang?: string): void {
    const { currency, gasFee } = context;

    switch (lang) {
      default:
        this.userMsg = {
          cause: `Sorry, you do not have enough ${currency} to cover transaction fee. ${
            gasFee && 'You need a buffer of atleast' + gasFee + ' ' + currency + ' to be fine '
          }`,
          suggestions: [],
        };
        break;
    }
  }
}

InsufficientGasFeeError.prototype.name = 'InsufficientGasFeeError';
export type InsufficientGasFeeErrorContext = { currency: string; gasFee?: string };
export default InsufficientGasFeeError;
