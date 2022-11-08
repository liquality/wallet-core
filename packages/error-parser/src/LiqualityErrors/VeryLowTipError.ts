import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class VeryLowTipError extends LiqualityError {
  constructor() {
    super(ERROR_NAMES.VeryLowTipError);
  }
}
