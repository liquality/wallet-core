import { LiqualityError } from './LiqualityError';
export class InsufficientLiquidityError extends LiqualityError<InsufficientLiquidityErrorContext> {
  public readonly name = InsufficientLiquidityError.name;

  constructor(data?: InsufficientLiquidityErrorContext) {
    super(data);
  }
}

export type InsufficientLiquidityErrorContext = { from: string; to: string; amount: string };
