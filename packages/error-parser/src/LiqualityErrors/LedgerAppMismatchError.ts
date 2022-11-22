import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class LedgerAppMismatchError extends LiqualityError {
  constructor() {
    super(ERROR_NAMES.LedgerAppMismatchError);
  }
}
