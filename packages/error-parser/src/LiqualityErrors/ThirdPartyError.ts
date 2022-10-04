import { UserErrorMessage } from 'src/types/types';
import { LiqualityError } from '.';
class ThirdPartyError extends LiqualityError<ThirdPartyErrorContext> {
  public readonly name = 'ThirdPartyError';

  constructor(context: ThirdPartyErrorContext) {
    super(context);
  }

  wrapUserErrorMessage(lang?: string): UserErrorMessage {
    const activity = this.context.activity;
    switch (lang) {
      default:
        this.userMsg = {
          cause: 'Sorry, something went wrong in a third party service we use in processing this transaction',
          suggestions: [],
        };
        if (activity === UserActivity.SWAP) {
          this.userMsg.suggestions.push('Select a different swap provider');
        }
        this.userMsg.suggestions.push('Try again at a later time');
        this.userMsg.suggestions.push(this.suggestContactSupport());
        break;
    }

    return this.userMsg;
  }
}

export enum UserActivity {
  SWAP = 'SWAP',
  UNKNOWN = 'UNKNOWN',
}
export type ThirdPartyErrorContext = { activity: UserActivity };

export default ThirdPartyError;
