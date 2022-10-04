import { UserErrorMessage } from 'src/types/types';
import { LiqualityError } from '.';
class InsufficientLiquidityError extends LiqualityError<InsufficientLiquidityErrorContext> {
  public readonly name = 'InsufficientLiquidityError';

  constructor(context: InsufficientLiquidityErrorContext) {
    super(context);
  }

  wrapUserErrorMessage(lang?: string): UserErrorMessage {
    const { amount, from, to } = this.context;

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

    return this.userMsg;
  }
}

export type InsufficientLiquidityErrorContext = { from: string; to: string; amount: string };
export default InsufficientLiquidityError;
