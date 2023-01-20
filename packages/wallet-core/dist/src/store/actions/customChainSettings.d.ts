import { ActionContext } from '..';
import { ChainId } from '@liquality/cryptoassets';
import { Network as ChainifyNetwork } from '@chainify/types';
import { WalletId, Network } from '../types';
export declare const saveCustomChainSettings: (context: ActionContext, { network, walletId, chainId, chanifyNetwork, }: {
    network: Network;
    walletId: WalletId;
    chainId: ChainId;
    chanifyNetwork: ChainifyNetwork;
}) => void;
export declare const removeCustomChainSettings: (context: ActionContext, { network, walletId, chainId }: {
    network: Network;
    walletId: WalletId;
    chainId: ChainId;
}) => void;
