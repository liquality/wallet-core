import { ActionContext } from '..';
import { MarketData, Network } from '../types';
export declare const updateMarketData: (context: ActionContext, { network }: {
    network: Network;
}) => Promise<{
    network: Network;
    marketData: MarketData[];
}>;
