import { LiqualityError } from './LiqualityError';
export class DuplicateTokenSymbolError extends LiqualityError {
  constructor() {
    super(DuplicateTokenSymbolError.name);
  }
}
