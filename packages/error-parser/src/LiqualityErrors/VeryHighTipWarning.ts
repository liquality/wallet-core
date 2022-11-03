import { LiqualityError } from './LiqualityError';
export class VeryHighTipWarning extends LiqualityError {
  constructor() {
    super(VeryHighTipWarning.name);
  }
}
