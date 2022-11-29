import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class ValidationError extends LiqualityError {
  constructor() {
    super(ERROR_NAMES.ValidationError);
  }

  setTranslationKey() {
    this.translationKey = '';
  }
}
