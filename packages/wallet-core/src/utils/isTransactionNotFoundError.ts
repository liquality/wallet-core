import { TxNotFoundError } from '@chainify/errors';
import { LiqualityError } from '@liquality/error-parser';

export function isTransactionNotFoundError(error: LiqualityError): boolean {
  return ((error as LiqualityError).rawError as Error).name === TxNotFoundError.name;
}
