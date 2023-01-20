import { ChainId } from '@liquality/cryptoassets';
import { ActionContext } from '..';
import { AccountId, Network, WalletId } from '../types';
export declare const exportPrivateKey: (context: ActionContext, { network, walletId, accountId, chainId, }: {
    network: Network;
    walletId: WalletId;
    accountId: AccountId;
    chainId: ChainId;
}) => Promise<string>;
