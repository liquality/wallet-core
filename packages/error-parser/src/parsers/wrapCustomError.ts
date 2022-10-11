import { InternalError } from '../LiqualityErrors';

export function wrapCustomError(customError: any) {
  const internalError = new InternalError();
  internalError.rawError = customError as never;

  return internalError;
}
