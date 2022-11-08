import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class InsufficientLiquidityError extends LiqualityError<InsufficientLiquidityErrorContext> {
  constructor(data?: InsufficientLiquidityErrorContext) {
    super(ERROR_NAMES.InsufficientLiquidityError, data);
  }

  setTranslationKey() {
    this.translationKey = '';
  }
}

export type InsufficientLiquidityErrorContext = { from: string; to: string; amount: string };
