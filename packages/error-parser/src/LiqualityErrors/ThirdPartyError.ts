import { LiqualityError, UserActivity } from './LiqualityError';
import { CAUSE, PLAIN, SUGGESTIONS, SWAP_ACTIVITY, UNKNOWN_ACTIVITY } from './translations/translationKeys';
export class ThirdPartyError extends LiqualityError<ThirdPartyErrorContext> {
  constructor(data?: ThirdPartyErrorContext) {
    super(ThirdPartyError.name, data);
  }

  setKeys(data?: ThirdPartyErrorContext): void {
    this.causeKey = `${this.name}.${PLAIN}.${CAUSE}`;

    if (data?.activity === UserActivity.SWAP) {
      this.suggestionKey = `${this.name}.${PLAIN}.${SUGGESTIONS}.${SWAP_ACTIVITY}`;
    } else {
      this.suggestionKey = `${this.name}.${PLAIN}.${SUGGESTIONS}.${UNKNOWN_ACTIVITY}`;
    }
  }
}

export type ThirdPartyErrorContext = { activity: UserActivity };
