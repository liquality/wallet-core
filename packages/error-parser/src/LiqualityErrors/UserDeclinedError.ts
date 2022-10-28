import { LiqualityError } from './LiqualityError';
export class UserDeclinedError extends LiqualityError {
  constructor() {
    super(UserDeclinedError.name);
  }
}
