import { LiqualityError } from '../../LiqualityErrors/LiqualityError';
import { ErrorParser } from '../ErrorParser';
export declare class ChainifyErrorParser extends ErrorParser<Error, null> {
    static readonly errorSource = "Chainify";
    protected _parseError(error: Error, data: ChainifyParserDataType): LiqualityError;
}
export declare type ChainifyParserDataType = null;
