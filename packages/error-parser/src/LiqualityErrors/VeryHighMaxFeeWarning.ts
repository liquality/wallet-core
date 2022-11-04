import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class VeryHighMaxFeeWarning extends LiqualityError<VeryHighMaxFeeWarningContext> {
  constructor(data?: VeryHighMaxFeeWarningContext) {
    super(ERROR_NAMES.VeryHighMaxFeeWarning, data);
  }
}

export type VeryHighMaxFeeWarningContext = { maxFeePerGas: string };
