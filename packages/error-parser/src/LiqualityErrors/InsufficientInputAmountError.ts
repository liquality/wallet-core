import { UserErrorMessage } from 'src/types/types';
import { LiqualityError } from '.';

class InsufficientInputAmountError extends LiqualityError<InsufficientInputAmountErrorContext> {
  public readonly name = 'InsufficientInputAmountError';

  constructor(context: InsufficientInputAmountErrorContext) {
    super(context);
  }

  wrapUserErrorMessage(lang?: string): UserErrorMessage {
    const { expectedMinimum, assetCode } = this.context;
    switch (lang) {
      default: {
        const inputTooLow = `Input amount is too low`;

        this.userMsg = {
          cause:
            expectedMinimum && assetCode
              ? inputTooLow
              : inputTooLow + `, expected minimum amount is ${expectedMinimum} ${assetCode}`,
          suggestions: [],
        };

        this.userMsg.suggestions.push('Please increase inputAmount');

        break;
      }
    }

    return this.userMsg;
  }
}

export type InsufficientInputAmountErrorContext = { expectedMinimum?: string; assetCode?: string };
export default InsufficientInputAmountError;
