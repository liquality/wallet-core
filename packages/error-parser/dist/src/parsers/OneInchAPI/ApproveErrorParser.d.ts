import { LiqualityError } from '../../LiqualityErrors/LiqualityError';
import { ErrorParser } from '../ErrorParser';
import { OneInchError } from '.';
export declare class OneInchApproveErrorParser extends ErrorParser<OneInchError, null> {
    static readonly errorSource = "OneInchApproveAPI";
    protected _parseError(error: OneInchError): LiqualityError;
}
