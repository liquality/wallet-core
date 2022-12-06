import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class LedgerDeviceNotUpdatedError extends LiqualityError {
  constructor() {
    super(ERROR_NAMES.LedgerDeviceNotUpdatedError);
  }
}
