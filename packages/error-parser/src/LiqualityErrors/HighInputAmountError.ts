import { LiqualityError } from '.';
export default class HighInputAmountError extends LiqualityError<HighInputAmountErrorContext> {
  public readonly name = HighInputAmountError.name;

  constructor(data?: HighInputAmountErrorContext) {
    super(data);
  }
}

export type HighInputAmountErrorContext = { expectedMaximum: string; assetCode: string };
