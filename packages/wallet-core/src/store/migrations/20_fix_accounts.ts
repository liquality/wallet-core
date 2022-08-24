import { ChainId, getAssetByAssetCode, getChainByChainId } from '@liquality/cryptoassets';
import { buildConfig } from '../..';
import { accountCreator, getNextAccountColor } from '../../utils/accounts';
import { AccountType } from '../types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const addMissingAccounts = {
  version: 20,
  migrate: async (state: any) => {
    const walletId = state.activeWalletId;
    const accounts: { [key: string]: any } = { [walletId]: { mainnet: [], testnet: [] } };
    const { networks, defaultAssets } = buildConfig;

    networks.forEach((network) => {
      const assetKeys = defaultAssets[network];

      buildConfig.chains.forEach(async (chainId) => {
        const assets = assetKeys.filter((asset) => {
          return getAssetByAssetCode(network, asset)?.chain === chainId;
        });

        const chain = getChainByChainId(network, chainId);
        const _account = accountCreator({
          walletId: walletId,
          network,
          account: {
            name: `${chain.name} 1`,
            alias: '',
            chain: chainId,
            addresses: [],
            assets,
            balances: {},
            type: AccountType.Default,
            index: 0,
            color: getNextAccountColor(chainId, 0),
            enabled: true,
          },
        });

        accounts[walletId][network].push(_account);

        // for RSK we add an extra account for legacy derivation path
        if (chainId === ChainId.Rootstock) {
          // get the legacy rsk derivation path
          const coinType = network === 'mainnet' ? '137' : '37310';
          const chain = getChainByChainId(network, ChainId.Rootstock);
          const _account = accountCreator({
            walletId: walletId,
            network,
            account: {
              name: `Legacy ${chain.name} 1`,
              alias: '',
              chain: ChainId.Rootstock,
              addresses: [],
              assets,
              balances: {},
              type: AccountType.Default,
              index: 0,
              derivationPath: `m/44'/${coinType}'/0'/0/0`,
              color: getNextAccountColor(ChainId.Rootstock, 1),
              enabled: true,
            },
          });

          accounts[walletId][network].push(_account);
        }
      });
    });

    const newState = {
      ...state,
      accounts,
    };
    return newState;
  },
};
