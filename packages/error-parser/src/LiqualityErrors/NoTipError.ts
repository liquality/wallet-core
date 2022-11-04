import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class NoTipError extends LiqualityError {
  constructor() {
    super(ERROR_NAMES.NoTipError);
  }
}
