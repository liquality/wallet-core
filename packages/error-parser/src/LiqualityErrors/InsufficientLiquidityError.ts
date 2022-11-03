import { LiqualityError } from './LiqualityError';
export class InsufficientLiquidityError extends LiqualityError<InsufficientLiquidityErrorContext> {
  constructor(data?: InsufficientLiquidityErrorContext) {
    super(InsufficientLiquidityError.name, data);
  }

  setTranslationKey() {
    this.translationKey = '';
  }
}

export type InsufficientLiquidityErrorContext = { from: string; to: string; amount: string };
