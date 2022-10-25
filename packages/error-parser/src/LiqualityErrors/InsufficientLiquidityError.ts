import { LiqualityError } from './LiqualityError';
export class InsufficientLiquidityError extends LiqualityError<InsufficientLiquidityErrorContext> {
  constructor(data?: InsufficientLiquidityErrorContext) {
    super(InsufficientLiquidityError.name, data);
  }
}

export type InsufficientLiquidityErrorContext = { from: string; to: string; amount: string };
