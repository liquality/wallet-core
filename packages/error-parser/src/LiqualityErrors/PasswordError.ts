import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class PasswordError extends LiqualityError {
  constructor() {
    super(ERROR_NAMES.PasswordError);
  }
}
