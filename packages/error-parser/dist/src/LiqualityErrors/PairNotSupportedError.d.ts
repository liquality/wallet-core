import { LiqualityError } from './LiqualityError';
export declare class PairNotSupportedError extends LiqualityError<PairNotSupportedErrorContext> {
    constructor(data?: PairNotSupportedErrorContext);
}
export declare type PairNotSupportedErrorContext = {
    from: string;
    to: string;
};
