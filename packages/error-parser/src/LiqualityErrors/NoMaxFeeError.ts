import { LiqualityError } from './LiqualityError';
export class NoMaxFeeError extends LiqualityError {
  public readonly name = NoMaxFeeError.name;

  constructor() {
    super();
  }
}
