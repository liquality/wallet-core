import { LiqualityError } from './LiqualityError';
export class SlippageTooHighError extends LiqualityError<SlippageTooHighErrorContext> {
  constructor(data?: SlippageTooHighErrorContext) {
    super(SlippageTooHighError.name, data);
  }
}

export type SlippageTooHighErrorContext = { expectedAmount: string; actualAmount: string; currency: string };
