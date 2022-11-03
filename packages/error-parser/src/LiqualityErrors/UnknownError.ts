import { LiqualityError } from './LiqualityError';
export class UnknownError extends LiqualityError {
  constructor() {
    super(UnknownError.name);
  }
}
