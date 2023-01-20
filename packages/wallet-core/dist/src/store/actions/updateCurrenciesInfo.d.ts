import { ActionContext } from '..';
import { Asset, CurrenciesInfo } from '../types';
export declare const updateCurrenciesInfo: (context: ActionContext, { assets }: {
    assets: Asset[];
}) => Promise<CurrenciesInfo>;
