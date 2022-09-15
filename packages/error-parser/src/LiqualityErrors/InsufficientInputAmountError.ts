import { LiqualityError } from '.';

class InsufficientInputAmountError extends LiqualityError {
  public readonly name = 'InsufficientInputAmountError';

  constructor(context?: InsufficientInputAmountErrorContext, lang?: string) {
    super();
    if (context) {
      this.wrapUserErrorMessage(context, lang);
    }
  }

  wrapUserErrorMessage(context: InsufficientInputAmountErrorContext, lang?: string): void {
    const { expectedMinimum, assetCode } = context;
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
  }
}

export type InsufficientInputAmountErrorContext = { expectedMinimum?: string; assetCode?: string };
export default InsufficientInputAmountError;
