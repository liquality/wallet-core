import { ChainId } from '@liquality/cryptoassets';
import { AccountInfo, ClientSettings } from '../../store/types';
import { Network as ChainifyNetwork } from '@chainify/types';
import { NearTypes } from '@chainify/near';
import { TerraTypes } from '@chainify/terra';
export declare const createClient: ({ chainId, settings, mnemonic, accountInfo, }: {
    chainId: ChainId;
    settings: ClientSettings<NearTypes.NearNetwork | TerraTypes.TerraNetwork | ChainifyNetwork>;
    mnemonic: string;
    accountInfo: AccountInfo;
}) => import("@chainify/client").Client<import("@chainify/client").Chain<any, ChainifyNetwork>, import("@chainify/client").Wallet<any, any>, import("@chainify/client").Swap<any, any, import("@chainify/client").Wallet<any, any>>, import("@chainify/client").Nft<any, any>>;
