import { LiqualityError } from '.';
class UnknownError extends LiqualityError {
  public readonly name = 'UnknownError';

  constructor() {
    super();
  }
}

export default UnknownError;
