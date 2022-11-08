import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class VeryHighTipWarning extends LiqualityError {
  constructor() {
    super(ERROR_NAMES.VeryHighTipWarning);
  }
}
