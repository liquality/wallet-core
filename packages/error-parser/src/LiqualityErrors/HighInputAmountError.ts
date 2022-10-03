import { LiqualityError } from '.';

class HighInputAmountError extends LiqualityError {
  public readonly name = 'HighInputAmountError';

  constructor(context?: HighInputAmountErrorContext, lang?: string) {
    super();
    if (context) {
      this.wrapUserErrorMessage(context, lang);
    }
  }

  wrapUserErrorMessage(context: HighInputAmountErrorContext, lang?: string): void {
    const { expectedMaximum, assetCode } = context;
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
  }
}

export type HighInputAmountErrorContext = { expectedMaximum?: string; assetCode?: string };
export default HighInputAmountError;
