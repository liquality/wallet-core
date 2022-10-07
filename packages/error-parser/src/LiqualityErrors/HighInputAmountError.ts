import { LiqualityError } from '.';
class HighInputAmountError extends LiqualityError<HighInputAmountErrorContext> {
  public readonly name = 'HighInputAmountError';

  constructor(data?: HighInputAmountErrorContext) {
    super(data);
  }
}

export type HighInputAmountErrorContext = { expectedMaximum: string; assetCode: string };
export default HighInputAmountError;
