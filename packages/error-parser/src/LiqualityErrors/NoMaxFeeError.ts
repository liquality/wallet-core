import { LiqualityError } from './LiqualityError';
export class NoMaxFeeError extends LiqualityError {
  constructor() {
    super(NoMaxFeeError.name);
  }
}
