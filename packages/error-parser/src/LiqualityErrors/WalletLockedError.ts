import { LiqualityError } from './LiqualityError';
export class WalletLockedError extends LiqualityError {
  constructor() {
    super(WalletLockedError.name);
  }

  setTranslationKey() {
    this.translationKey = '';
  }
}
