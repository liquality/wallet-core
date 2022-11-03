import { LiqualityError } from './LiqualityError';
export class NoTipError extends LiqualityError {
  constructor() {
    super(NoTipError.name);
  }
}
