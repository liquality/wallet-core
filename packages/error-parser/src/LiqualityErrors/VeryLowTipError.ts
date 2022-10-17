import { LiqualityError } from './LiqualityError';
export class VeryLowTipError extends LiqualityError {
  public readonly name = VeryLowTipError.name;

  constructor() {
    super();
  }
}
