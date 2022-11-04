import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class UnknownError extends LiqualityError {
  constructor() {
    super(ERROR_NAMES.UnknownError);
  }
}
