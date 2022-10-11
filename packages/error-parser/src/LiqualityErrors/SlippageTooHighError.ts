import { LiqualityError } from './LiqualityError';
export class SlippageTooHighError extends LiqualityError<SlippageTooHighErrorContext> {
  public readonly name = SlippageTooHighError.name;

  constructor(data?: SlippageTooHighErrorContext) {
    super(data);
  }
}

export type SlippageTooHighErrorContext = { expectedAmount: string; actualAmount: string; currency: string };
