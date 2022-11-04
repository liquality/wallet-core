import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';

export class PairNotSupportedError extends LiqualityError<PairNotSupportedErrorContext> {
  constructor(data?: PairNotSupportedErrorContext) {
    super(ERROR_NAMES.PairNotSupportedError, data);
  }
}

export type PairNotSupportedErrorContext = { from: string; to: string };
