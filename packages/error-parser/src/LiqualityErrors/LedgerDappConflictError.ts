import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class LedgerDappConflictError extends LiqualityError {
  constructor() {
    super(ERROR_NAMES.LedgerDappConflictError);
  }
}
