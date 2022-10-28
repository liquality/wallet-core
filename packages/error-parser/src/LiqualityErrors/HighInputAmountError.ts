import { LiqualityError } from './LiqualityError';
export class HighInputAmountError extends LiqualityError<HighInputAmountErrorContext> {
  constructor(data?: HighInputAmountErrorContext) {
    super(HighInputAmountError.name, data);
  }

  setTranslationKey() {
    this.translationKey = ""
  }
}

export type HighInputAmountErrorContext = { expectedMaximum: string; assetCode: string };
