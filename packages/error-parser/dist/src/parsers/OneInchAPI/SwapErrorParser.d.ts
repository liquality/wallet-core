import { LiqualityError } from '../../LiqualityErrors/LiqualityError';
import { ErrorParser } from '../ErrorParser';
import { OneInchError } from '.';
export declare class OneInchSwapErrorParser extends ErrorParser<OneInchError, OneInchSwapParserDataType> {
    static readonly errorSource = "OneInchSwapAPI";
    protected _parseError(error: OneInchError, data: OneInchSwapParserDataType): LiqualityError;
}
export declare type OneInchSwapParserDataType = {
    from: string;
    to: string;
    amount: string;
    balance: string;
};
