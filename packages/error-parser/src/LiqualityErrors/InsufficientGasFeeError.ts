import { LiqualityError } from './LiqualityError';
export class InsufficientGasFeeError extends LiqualityError<InsufficientGasFeeErrorContext> {
  constructor(data?: InsufficientGasFeeErrorContext) {
    super(InsufficientGasFeeError.name, data);
  }
}

export type InsufficientGasFeeErrorContext = { currency: string; gasFee: string };
