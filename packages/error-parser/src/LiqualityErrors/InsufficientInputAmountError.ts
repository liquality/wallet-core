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
      default:
        this.userMsg = {
          cause: `Input amount is too low`,
          suggestions: [],
        };

        this.userMsg.suggestions.push('Please increase inputAmount');
        if (expectedMinimum && assetCode) {
          this.userMsg.suggestions.push(`Expected minimum amount is ${expectedMinimum} ${assetCode}`);
        }

        break;
    }
  }
}

export type InsufficientInputAmountErrorContext = { expectedMinimum?: string; assetCode?: string };
export default InsufficientInputAmountError;
