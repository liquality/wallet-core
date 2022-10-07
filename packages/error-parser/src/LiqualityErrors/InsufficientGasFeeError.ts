import { LiqualityError } from '.';
class InsufficientGasFeeError extends LiqualityError<InsufficientGasFeeErrorContext> {
  public readonly name = 'InsufficientGasFeeError';

  constructor(data?: InsufficientGasFeeErrorContext) {
    super(data);
  }
}

export type InsufficientGasFeeErrorContext = { currency: string; gasFee: string };
export default InsufficientGasFeeError;
