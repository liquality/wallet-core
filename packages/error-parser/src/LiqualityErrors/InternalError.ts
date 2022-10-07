import { LiqualityError } from '.';
class InternalError extends LiqualityError {
  public readonly name = 'InternalError';

  constructor() {
    super();
  }
}

export default InternalError;
