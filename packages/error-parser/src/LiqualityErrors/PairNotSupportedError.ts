import { LiqualityError } from './LiqualityError';

export class PairNotSupportedError extends LiqualityError<PairNotSupportedErrorContext> {
  constructor(data?: PairNotSupportedErrorContext) {
    super(PairNotSupportedError.name, data);
  }
}

export type PairNotSupportedErrorContext = { from: string; to: string };
