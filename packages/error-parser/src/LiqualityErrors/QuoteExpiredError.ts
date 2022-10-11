import { LiqualityError } from './LiqualityError';
export class QuoteExpiredError extends LiqualityError {
  public readonly name = QuoteExpiredError.name;

  constructor() {
    super();
  }
}
