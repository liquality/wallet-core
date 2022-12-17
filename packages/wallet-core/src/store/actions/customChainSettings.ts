
import { ActionContext, rootActionContext } from '..';
import { ChainId } from '@liquality/cryptoassets';
import { Network as ChainifyNetwork } from '@chainify/types';
import {
    WalletId,
    Network
} from '../types';

export const saveCustomChainSettings = (context: ActionContext, {
    network,
    walletId,
    chainId,
    chanifyNetwork
}: { network: Network; walletId: WalletId; chainId: ChainId; chanifyNetwork: ChainifyNetwork }) => {
    const { commit } = rootActionContext(context);
    commit.SET_CUSTOM_CHAIN_SETTINGS({
        network,
        walletId,
        chainId,
        chanifyNetwork
    });
};


export const removeCustomChainSettings = (context: ActionContext, {
    network,
    walletId,
    chainId
}: { network: Network; walletId: WalletId; chainId: ChainId; }) => {
    const { commit } = rootActionContext(context);
    commit.REMOVE_CUSTOM_CHAIN_SETTINGS({
        network,
        walletId,
        chainId
    });
};
