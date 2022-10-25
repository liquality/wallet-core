import { LiqualityError } from './LiqualityError';
export class PasswordError extends LiqualityError {
  constructor() {
    super(PasswordError.name);
  }
}
