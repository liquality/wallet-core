import { ObjectLiteral } from '../types/types';

export function isLiqualityErrorString(error: string): boolean {
  return error.startsWith(LIQUALITY_ERROR_STRING_STARTER);
}

export function LiqualityErrorStringToJson(error: string): ObjectLiteral {
  return JSON.parse(error.replace(LIQUALITY_ERROR_STRING_STARTER, ''));
}

export const LIQUALITY_ERROR_STRING_STARTER = 'LIQUALITY_ERROR_FROM_ERROR_PARSER_PACKAGE';
