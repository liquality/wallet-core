import { ActionContext } from '..';
import { Asset, FiatRates } from '../types';
export declare const updateFiatRates: (context: ActionContext, { assets }: {
    assets: Asset[];
}) => Promise<FiatRates>;
