import { LiqualityError } from './LiqualityError';
export class PasswordError extends LiqualityError {
  public readonly name = PasswordError.name;

  constructor() {
    super();
  }
}
