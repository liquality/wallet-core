import { LiqualityError } from './LiqualityError';
export class VeryLowMaxFeeError extends LiqualityError<VeryLowMaxFeeErrorContext> {
  constructor(data?: VeryLowMaxFeeErrorContext) {
    super(VeryLowMaxFeeError.name, data);
  }
}

export type VeryLowMaxFeeErrorContext = { maxFeePerGas: string };
