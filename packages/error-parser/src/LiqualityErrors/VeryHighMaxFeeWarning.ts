import { LiqualityError } from './LiqualityError';
export class VeryHighMaxFeeWarning extends LiqualityError<VeryHighMaxFeeWarningContext> {
  public readonly name = VeryHighMaxFeeWarning.name;

  constructor(data?: VeryHighMaxFeeWarningContext) {
    super(data);
  }
}

export type VeryHighMaxFeeWarningContext = { maxFeePerGas: string };
