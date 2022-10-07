import { LiqualityError } from '.';
class InsufficientLiquidityError extends LiqualityError<InsufficientLiquidityErrorContext> {
  public readonly name = 'InsufficientLiquidityError';

  constructor(data?: InsufficientLiquidityErrorContext) {
    super(data);
  }
}

export type InsufficientLiquidityErrorContext = { from: string; to: string; amount: string };
export default InsufficientLiquidityError;
