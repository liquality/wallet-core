import { LiqualityError } from '.';

class PairNotSupportedError extends LiqualityError {
  public readonly name = 'PairNotSupportedError';

  constructor(context?: PairNotSupportedErrorContext, lang?: string) {
    super();
    this.wrapUserErrorMessage(context, lang);
  }

  wrapUserErrorMessage(context?: PairNotSupportedErrorContext, lang?: string): void {
    const activity = context?.activity;
    switch (lang) {
      default:
        this.userMsg = {
          cause: `Sorry, swap provider does not support selected pair`,
          suggestions: [],
        };
        if (activity === UserActivity.SWAP) {
          this.userMsg.suggestions.push('Select a different swap provider');
        }
        this.userMsg.suggestions.push(this.suggestContactSupport());
        break;
    }
  }
}

export enum UserActivity {
  SWAP = 'SWAP',
}
export type PairNotSupportedErrorContext = { activity: string; from?: string; to?: string };

export default PairNotSupportedError;
