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
      default:
        this.userMsg = {
          cause: `Input amount is too high`,
          suggestions: [],
        };

        this.userMsg.suggestions.push('Please decrease input amount');
        if (expectedMaximum && assetCode) {
          this.userMsg.suggestions.push(`Expected maximum amount is ${expectedMaximum} ${assetCode}`);
        }

        break;
    }
  }
}

export type HighInputAmountErrorContext = { expectedMaximum?: string; assetCode?: string };
export default HighInputAmountError;
