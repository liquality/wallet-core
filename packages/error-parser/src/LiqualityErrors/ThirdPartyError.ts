import { LiqualityError } from '.';
import { ErrorType } from '../types/types';

class ThirdPartyError extends LiqualityError {
  constructor(context?: ThirdPartyErrorContext, lang?: string) {
    super();
    this.wrapUserErrorMessage(context, lang);
  }

  wrapUserErrorMessage(context?: ThirdPartyErrorContext, lang?: string): void {
    const activity = context?.activity;
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
  }
}

ThirdPartyError.prototype.name = ErrorType.ThirdPartyError;

export enum UserActivity {
  SWAP = 'SWAP',
}
export type ThirdPartyErrorContext = { activity: string };

export default ThirdPartyError;
