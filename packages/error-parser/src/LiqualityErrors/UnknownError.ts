import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class UnknownError extends LiqualityError {
  reportable = true;

  constructor() {
    super(ERROR_NAMES.UnknownError);
  }
}
