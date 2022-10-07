import { LiqualityError, UserActivity } from '.';
import { CAUSE, PLAIN, SUGGESTIONS, SWAP_ACTIVITY, UNKNOWN_ACTIVITY } from './translations/translationKeys';
export default class ThirdPartyError extends LiqualityError<ThirdPartyErrorContext> {
  public readonly name = ThirdPartyError.name;

  constructor(data?: ThirdPartyErrorContext) {
    super(data);
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
