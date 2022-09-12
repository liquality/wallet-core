import { LiqualityError } from '.';
import { ErrorType } from '../types/types';

class InsufficientLiquidityError extends LiqualityError {
  constructor(context?: InsufficientLiquidityErrorContext, lang?: string) {
    super();
    if (context) {
      this.wrapUserErrorMessage(context, lang);
    }
  }

  wrapUserErrorMessage(context: InsufficientLiquidityErrorContext, lang?: string): void {
    const { amount, from, to } = context;

    switch (lang) {
      default:
        this.userMsg = {
          cause: `Sorry, your swap of ${amount} from ${from} to ${to} could not be completed due to insufficient liquidity`,
          suggestions: [
            'Reduce your swap amount',
            'Try a different swap pair',
            'Select a different swap provider from our list of swap providers',
            'Try again at a later time',
          ],
        };
        break;
    }
  }
}

InsufficientLiquidityError.prototype.name = ErrorType.InsufficientLiquidityError;

export type InsufficientLiquidityErrorContext = { from: string; to: string; amount: string };
export default InsufficientLiquidityError;
