import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class UserDeclinedError extends LiqualityError {
  constructor() {
    super(ERROR_NAMES.UserDeclinedError);
  }

  setTranslationKey() {
    this.translationKey = '';
  }
}
