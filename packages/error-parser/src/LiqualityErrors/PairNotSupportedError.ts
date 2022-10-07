import { LiqualityError } from '.';

export default class PairNotSupportedError extends LiqualityError<PairNotSupportedErrorContext> {
  public readonly name = PairNotSupportedError.name;

  constructor(data?: PairNotSupportedErrorContext) {
    super(data);
  }
}

export type PairNotSupportedErrorContext = { from: string; to: string };
