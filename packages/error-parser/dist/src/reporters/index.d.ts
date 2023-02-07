import { LiqualityErrorJSON } from '../types';
export declare function updateErrorReporterConfig({ useReporter, callback, }: {
    useReporter?: boolean;
    callback?: (error: LiqualityErrorJSON) => any;
}): void;
export declare function reportLiqualityError(error: any): void;
