import { LiqualityError } from './LiqualityError';
export declare class InternalError extends LiqualityError {
    reportable: boolean;
    constructor(rawError?: any);
}
