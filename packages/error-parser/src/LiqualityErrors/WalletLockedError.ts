import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class WalletLockedError extends LiqualityError {
  constructor() {
    super(ERROR_NAMES.WalletLockedError);
  }

  setTranslationKey() {
    this.translationKey = '';
  }
}
