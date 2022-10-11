import { LiqualityError } from './LiqualityError';
export class InternalError extends LiqualityError {
  public readonly name = InternalError.name;

  constructor() {
    super();
  }
}
