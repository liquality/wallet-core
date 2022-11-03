import { LiqualityError } from './LiqualityError';
export class VeryLowTipError extends LiqualityError {
  constructor() {
    super(VeryLowTipError.name);
  }
}
