import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class NoActiveWalletError extends LiqualityError {
  constructor() {
    super(ERROR_NAMES.NoActiveWalletError);
  }

  setTranslationKey() {
    this.translationKey = '';
  }
}
