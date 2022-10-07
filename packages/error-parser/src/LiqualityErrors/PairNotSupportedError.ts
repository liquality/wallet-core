import { LiqualityError } from '.';

class PairNotSupportedError extends LiqualityError<PairNotSupportedErrorContext> {
  public readonly name = 'PairNotSupportedError';

  constructor(data?: PairNotSupportedErrorContext) {
    super(data);
  }
}

export type PairNotSupportedErrorContext = { from: string; to: string };

export default PairNotSupportedError;
