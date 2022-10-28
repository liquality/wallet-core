import { LiqualityError } from './LiqualityError';
export class NoActiveWalletError extends LiqualityError {
  constructor() {
    super(NoActiveWalletError.name);
  }

  setTranslationKey() {
    this.translationKey = ""
   }
}
