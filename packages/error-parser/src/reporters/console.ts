import { LiqualityErrorJSON } from '../types/types';
import { LiqualityError } from '../LiqualityErrors/LiqualityError';

export function reportToConsole(error: LiqualityError | LiqualityErrorJSON) {
  console.log(error);
}
