import { LiqualityError } from './LiqualityError';
export class UnknownError extends LiqualityError {
  public readonly name = UnknownError.name;

  constructor() {
    super();
  }
}
