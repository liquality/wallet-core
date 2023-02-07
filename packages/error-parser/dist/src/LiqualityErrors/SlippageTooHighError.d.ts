import { LiqualityError } from './LiqualityError';
export declare class SlippageTooHighError extends LiqualityError<SlippageTooHighErrorContext> {
    constructor(data?: SlippageTooHighErrorContext);
}
export declare type SlippageTooHighErrorContext = {
    expectedAmount: string;
    actualAmount: string;
    currency: string;
};
