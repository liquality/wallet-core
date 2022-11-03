import { LiqualityError, UserActivity } from './LiqualityError';
import { PLAIN, SWAP_ACTIVITY, UNKNOWN_ACTIVITY } from './translations/translationKeys';
export class ThirdPartyError extends LiqualityError<ThirdPartyErrorContext> {
  constructor(data?: ThirdPartyErrorContext) {
    super(ThirdPartyError.name, data);
  }

  setTranslationKey(data?: ThirdPartyErrorContext): void {
    this.translationKey = `${this.name}.${PLAIN}`;

    if (data?.activity === UserActivity.SWAP) {
      this.translationKey = `${this.name}.${PLAIN}.${SWAP_ACTIVITY}`;
    } else {
      this.translationKey = `${this.name}.${PLAIN}.${UNKNOWN_ACTIVITY}`;
    }
  }
}

export type ThirdPartyErrorContext = { activity: UserActivity };
