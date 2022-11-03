import { LiqualityError } from './LiqualityError';
export class VeryHighMaxFeeWarning extends LiqualityError<VeryHighMaxFeeWarningContext> {
  constructor(data?: VeryHighMaxFeeWarningContext) {
    super(VeryHighMaxFeeWarning.name, data);
  }
}

export type VeryHighMaxFeeWarningContext = { maxFeePerGas: string };
