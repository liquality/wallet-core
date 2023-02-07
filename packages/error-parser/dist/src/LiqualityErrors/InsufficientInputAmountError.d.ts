import { LiqualityError } from './LiqualityError';
export declare class InsufficientInputAmountError extends LiqualityError<InsufficientInputAmountErrorContext> {
    constructor(data?: InsufficientInputAmountErrorContext);
}
export declare type InsufficientInputAmountErrorContext = {
    expectedMinimum: string;
    assetCode: string;
};
