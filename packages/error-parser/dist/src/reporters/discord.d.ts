import { LiqualityError } from '../LiqualityErrors/LiqualityError';
import { LiqualityErrorJSON } from '../types';
export declare const reportToDiscord: (error: LiqualityError | LiqualityErrorJSON) => Promise<void>;
