import { UserErrorMessage } from 'src/types/types';
import { LiqualityError } from '.';
class InsufficientGasFeeError extends LiqualityError<InsufficientGasFeeErrorContext> {
  public readonly name = 'InsufficientGasFeeError';

  constructor(context: InsufficientGasFeeErrorContext) {
    super(context);
  }

  wrapUserErrorMessage(lang?: string): UserErrorMessage {
    const { currency, gasFee } = this.context;

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
    return this.userMsg;
  }
}

export type InsufficientGasFeeErrorContext = { currency: string; gasFee?: string };
export default InsufficientGasFeeError;
