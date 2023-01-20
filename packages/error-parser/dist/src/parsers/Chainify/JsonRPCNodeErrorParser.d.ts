import { LiqualityError } from '../../LiqualityErrors';
import { ErrorParser } from '../ErrorParser';
export declare class JsonRPCNodeErrorParser extends ErrorParser<Error, NodeParserDataType> {
    static readonly errorSource = "JsonRPCNode";
    protected _parseError(error: Error): LiqualityError;
}
export declare type NodeParserDataType = null;
