import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class SlippageTooHighError extends LiqualityError<SlippageTooHighErrorContext> {
  constructor(data?: SlippageTooHighErrorContext) {
    super(ERROR_NAMES.SlippageTooHighError, data);
  }
}

export type SlippageTooHighErrorContext = { expectedAmount: string; actualAmount: string; currency: string };
