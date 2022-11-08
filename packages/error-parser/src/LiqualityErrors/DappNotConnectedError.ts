import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';

export class DappNotConnectedError extends LiqualityError<DappNotConnectedErrorContext> {
  constructor(data?: DappNotConnectedErrorContext) {
    super(ERROR_NAMES.DappNotConnectedError, data);
  }
  setTranslationKey() {
    this.translationKey = '';
  }
}

export type DappNotConnectedErrorContext = { dapp: string; chain: string };
