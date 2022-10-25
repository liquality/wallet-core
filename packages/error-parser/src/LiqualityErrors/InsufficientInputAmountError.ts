import { LiqualityError } from './LiqualityError';

export class InsufficientInputAmountError extends LiqualityError<InsufficientInputAmountErrorContext> {
  constructor(data?: InsufficientInputAmountErrorContext) {
    super(InsufficientInputAmountError.name, data);
  }
}

export type InsufficientInputAmountErrorContext = { expectedMinimum: string; assetCode: string };
