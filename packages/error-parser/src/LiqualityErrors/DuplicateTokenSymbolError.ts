import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class DuplicateTokenSymbolError extends LiqualityError {
  constructor() {
    super(ERROR_NAMES.DuplicateTokenSymbolError);
  }
}
