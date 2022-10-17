import { LiqualityError } from './LiqualityError';
export class VeryLowMaxFeeError extends LiqualityError<VeryLowMaxFeeErrorContext> {
  public readonly name = VeryLowMaxFeeError.name;

  constructor(data?: VeryLowMaxFeeErrorContext) {
    super(data);
  }
}

export type VeryLowMaxFeeErrorContext = { maxFeePerGas: string };
