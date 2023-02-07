import BigNumber from 'bignumber.js';
import { IAsset } from './interfaces/IAsset';
export declare function ensure0x(hash: string): string;
export declare function remove0x(hash: string): string;
export declare function unitToCurrency(asset: IAsset, value: number | BigNumber): BigNumber;
export declare function currencyToUnit(asset: IAsset, value: number | BigNumber): BigNumber;
