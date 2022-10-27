import { CUSTOM_ERRORS, InternalError, LiqualityError } from '../LiqualityErrors';
import { reportLiqualityError } from '../reporters';
import { ObjectLiteral } from '../types/types';

export function isLiqualityErrorString(error: string): boolean {
  return error.startsWith(LIQUALITY_ERROR_STRING_STARTER);
}

export function liqualityErrorStringToJson(error: string): ObjectLiteral {
  return JSON.parse(error.replace(LIQUALITY_ERROR_STRING_STARTER, ''));
}

export const LIQUALITY_ERROR_STRING_STARTER = 'LIQUALITY_ERROR_FROM_ERROR_PARSER_PACKAGE';

export function createInternalError(customError: any): InternalError {
  const internalError = new InternalError(customError);
  reportLiqualityError(internalError);
  return internalError;
}

export function errorToLiqualityErrorString(error: any): string {
  if (error instanceof LiqualityError) return error.toString();
  else if (error instanceof Error && isLiqualityErrorString(error.message)) return error.message;
  else return createInternalError(CUSTOM_ERRORS.Unknown(error)).toString();
}
