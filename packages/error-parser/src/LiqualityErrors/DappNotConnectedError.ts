import { LiqualityError } from './LiqualityError';

export class DappNotConnectedError extends LiqualityError<DappNotConnectedErrorContext> {
  constructor(data?: DappNotConnectedErrorContext) {
    super(DappNotConnectedError.name, data);
  }
  setTranslationKey() {
    this.translationKey = '';
  }
}

export type DappNotConnectedErrorContext = { dapp: string; chain: string };
