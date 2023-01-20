import { LiqualityError } from './LiqualityError';
export declare class DappNotConnectedError extends LiqualityError<DappNotConnectedErrorContext> {
    constructor(data?: DappNotConnectedErrorContext);
    setTranslationKey(): void;
}
export declare type DappNotConnectedErrorContext = {
    dapp: string;
    chain: string;
};
