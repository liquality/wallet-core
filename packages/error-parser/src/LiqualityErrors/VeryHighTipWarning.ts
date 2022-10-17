import { LiqualityError } from './LiqualityError';
export class VeryHighTipWarning extends LiqualityError {
  public readonly name = VeryHighTipWarning.name;

  constructor() {
    super();
  }
}
