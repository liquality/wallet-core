import { ERROR_NAMES, TRANSLATION_KEYS } from '../config';
import { LiqualityError, UserActivity } from './LiqualityError';

const { PLAIN, PLACEHOLDER, SWAP_ACTIVITY, UNKNOWN_ACTIVITY } = TRANSLATION_KEYS;

export class ThirdPartyError extends LiqualityError<ThirdPartyErrorContext> {
  reportable = true;

  constructor(data?: ThirdPartyErrorContext) {
    super(ERROR_NAMES.ThirdPartyError, data);
  }

  setTranslationKey(data?: ThirdPartyErrorContext): void {
    this.translationKey = `${this.name}.${PLAIN}`;

    if (data?.activity === UserActivity.SWAP) {
      this.translationKey = `${this.name}.${PLACEHOLDER}.${SWAP_ACTIVITY}`;
    } else {
      this.translationKey = `${this.name}.${PLAIN}.${UNKNOWN_ACTIVITY}`;
    }
  }
}

export type ThirdPartyErrorContext = { activity: UserActivity };
