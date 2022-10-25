import { LiqualityError } from './LiqualityError';
export class InternalError extends LiqualityError {
  constructor(rawError?: any) {
    super(InternalError.name);
    if (rawError) this.rawError = rawError;
  }
}
