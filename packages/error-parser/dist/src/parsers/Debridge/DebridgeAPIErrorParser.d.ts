import { LiqualityError } from '../../LiqualityErrors';
import { DebridgeError } from '.';
import { ErrorParser } from '../ErrorParser';
export declare class DebridgeAPIErrorParser extends ErrorParser<DebridgeError, DebridgeAPIErrorParserDataType> {
    static readonly errorSource = "Debridge API";
    protected _parseError(error: DebridgeError): LiqualityError;
}
export declare type DebridgeAPIErrorParserDataType = null;
