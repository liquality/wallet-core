import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class LowSpeedupFeeError extends LiqualityError {
  constructor() {
    super(ERROR_NAMES.LowSpeedupFeeError);
  }
}
