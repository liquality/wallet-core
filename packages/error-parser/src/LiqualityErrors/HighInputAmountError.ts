import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class HighInputAmountError extends LiqualityError<HighInputAmountErrorContext> {
  constructor(data?: HighInputAmountErrorContext) {
    super(ERROR_NAMES.HighInputAmountError, data);
  }

  setTranslationKey() {
    this.translationKey = '';
  }
}

export type HighInputAmountErrorContext = { expectedMaximum: string; assetCode: string };
