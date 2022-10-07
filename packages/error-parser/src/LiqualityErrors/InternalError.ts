import { LiqualityError } from '.';
export default class InternalError extends LiqualityError {
  public readonly name = InternalError.name;

  constructor() {
    super();
  }
}
