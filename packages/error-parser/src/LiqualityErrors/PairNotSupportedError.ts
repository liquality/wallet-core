import { UserErrorMessage } from 'src/types/types';
import { LiqualityError } from '.';

class PairNotSupportedError extends LiqualityError<PairNotSupportedErrorContext> {
  public readonly name = 'PairNotSupportedError';

  constructor(context: PairNotSupportedErrorContext) {
    super(context);
  }

  wrapUserErrorMessage(lang?: string): UserErrorMessage {
    const activity = this.context.activity;
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

    return this.userMsg;
  }
}

export enum UserActivity {
  SWAP = 'SWAP',
}
export type PairNotSupportedErrorContext = { activity: string; from?: string; to?: string };

export default PairNotSupportedError;
