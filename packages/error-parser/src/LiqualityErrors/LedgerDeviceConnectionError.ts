import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class LedgerDeviceConnectionError extends LiqualityError {
  constructor() {
    super(ERROR_NAMES.LedgerDeviceConnectionError);
  }

  setTranslationKey() {
    this.translationKey = '';
  }
}
