import { RootState } from '../types';
declare const LATEST_VERSION: number;
declare function isMigrationNeeded(state: RootState): boolean;
declare function processMigrations(state: RootState): Promise<RootState>;
export { LATEST_VERSION, isMigrationNeeded, processMigrations };
