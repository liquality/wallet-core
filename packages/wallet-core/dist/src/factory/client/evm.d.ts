import { Chain, Client, Swap, Wallet } from '@chainify/client';
import { Network } from '@chainify/types';
import { ChainifyNetwork } from '../../types';
import { AccountInfo, ClientSettings } from '../../store/types';
import { EvmChain } from '@liquality/cryptoassets';
export declare function createEvmClient(chain: EvmChain, settings: ClientSettings<ChainifyNetwork>, mnemonic: string, accountInfo: AccountInfo): Client<Chain<any, Network>, Wallet<any, any>, Swap<any, any, Wallet<any, any>>>;
