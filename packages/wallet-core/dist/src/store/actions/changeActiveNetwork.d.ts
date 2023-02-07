import { ActionContext } from '..';
import { Network } from '../types';
export declare const changeActiveNetwork: (context: ActionContext, { network }: {
    network: Network;
}) => Promise<void>;
