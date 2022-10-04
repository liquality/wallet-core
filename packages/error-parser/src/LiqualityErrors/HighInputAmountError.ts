import { UserErrorMessage } from 'src/types/types';
import { LiqualityError } from '.';

class HighInputAmountError extends LiqualityError {
  public readonly name = 'HighInputAmountError';

  constructor(context: HighInputAmountErrorContext) {
    super(context);
  }

  wrapUserErrorMessage(lang?: string): UserErrorMessage {
    const { expectedMaximum, assetCode } = this.context;
    switch (lang) {
      default: {
        const inputTooHigh = `Input amount is too high`;
        this.userMsg = {
          cause:
            expectedMaximum && assetCode
              ? inputTooHigh
              : inputTooHigh + `, expected maximum amount is ${expectedMaximum} ${assetCode}`,
          suggestions: [],
        };

        this.userMsg.suggestions.push('Please decrease input amount');

        break;
      }
    }

    return this.userMsg;
  }
}

export type HighInputAmountErrorContext = { expectedMaximum?: string; assetCode?: string };
export default HighInputAmountError;
