import { LiqualityError } from '.';

class InsufficientInputAmountError extends LiqualityError<InsufficientInputAmountErrorContext> {
  public readonly name = 'InsufficientInputAmountError';

  constructor(data?: InsufficientInputAmountErrorContext) {
    super(data);
  }
}

export type InsufficientInputAmountErrorContext = { expectedMinimum: string; assetCode: string };
export default InsufficientInputAmountError;
