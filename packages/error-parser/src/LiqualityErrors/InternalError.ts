import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class InternalError extends LiqualityError {
  constructor(rawError?: any) {
    super(ERROR_NAMES.InternalError);
    if (rawError) this.rawError = rawError;
  }
}
