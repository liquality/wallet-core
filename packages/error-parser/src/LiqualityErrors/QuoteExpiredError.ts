import { LiqualityError } from './LiqualityError';
export class QuoteExpiredError extends LiqualityError {
  constructor() {
    super(QuoteExpiredError.name);
  }
}
