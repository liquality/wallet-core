import { LiqualityError } from './LiqualityError';
export declare class InsufficientFundsError extends LiqualityError<InsufficientFundsErrorContext> {
    constructor(data?: InsufficientFundsErrorContext);
}
export declare type InsufficientFundsErrorContext = {
    availAmt: string;
    neededAmt: string;
    currency: string;
};
