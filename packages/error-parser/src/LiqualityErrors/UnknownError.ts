import { LiqualityError } from '.';
export default class UnknownError extends LiqualityError {
  public readonly name = UnknownError.name;

  constructor() {
    super();
  }
}
