import { ChainId, getAllAssets, getAssetByAssetCode, getChainByChainId } from '@liquality/cryptoassets';
import buildConfig from '../../build.config';
import { accountCreator, getNextAccountColor } from '../../utils/accounts';
import { AccountType, Network } from '../types';

export const multipleAccountSupport = {
  // multiple account support
  version: 5,
  migrate: async (state: any) => {
    const { enabledAssets } = state;
    const walletId = state.activeWalletId;
    const accounts: any = {
      [walletId]: {
        mainnet: [],
        testnet: [],
      },
    };

    buildConfig.networks.forEach((network) => {
      const assetKeys = enabledAssets[network]?.[walletId] || [];

      buildConfig.chains.forEach((chainId: ChainId) => {
        const assets = assetKeys.filter((asset: string) => {
          return getAssetByAssetCode(network, asset).chain === chainId;
        });

        const chain = getChainByChainId(network, chainId);

        const addresses: string[] = [];

        if (
          state.addresses &&
          state.addresses?.[network] &&
          state.addresses?.[network]?.[walletId] &&
          state.addresses?.[network]?.[walletId]?.[chain.nativeAsset[0].code]
        ) {
          addresses.push(state.addresses[network][walletId][chain.nativeAsset[0].code]);
        }

        const _account = accountCreator({
          walletId,
          network,
          // @ts-ignore Old migration has broken after changes
          account: {
            name: `${chain.name} 1`,
            chain: chainId,
            addresses,
            assets,
            balances: {},
            type: AccountType.Default,
            index: 0,
            color: getNextAccountColor(chainId, 0),
          },
        });

        accounts[walletId][network].push(_account);
      });
    });

    delete state.addresses;
    delete state.balances;

    // Move .network property to .chain
    const customTokens = {
      mainnet: {
        [walletId]: state.customTokens.mainnet?.[walletId]?.map((token: any) => {
          const newCustomToken = { ...token, chain: token.network };
          delete newCustomToken.network;
          return newCustomToken;
        }),
      },
      testnet: {
        [walletId]: state.customTokens.testnet?.[walletId]?.map((token: any) => {
          const newCustomToken = { ...token, chain: token.network };
          delete newCustomToken.network;
          return newCustomToken;
        }),
      },
    };

    const migrateHistory = (state: any, network: Network, walletId: string) => {
      return (
        state.history[network]?.[walletId]
          // Remove defunct swap statuses
          ?.filter((item: any) => !['QUOTE', 'SECRET_READY'].includes(item.status))
          // INITIATION statuses should be moved to FUNDED to prevent double funding
          .map((item: any) =>
            ['INITIATION_REPORTED', 'INITIATION_CONFIRMED'].includes(item.status) ? { ...item, status: 'FUNDED' } : item
          )
          // Account ids should be assigned to swaps
          .map((item: any) => {
            if (item.type !== 'SWAP') return item;
            const allAssets = getAllAssets();
            const fromChain = allAssets[network][item.from].chain;
            const toChain = allAssets[network][item.to].chain;
            const fromAccountId = accounts[walletId][network].find((account: any) => account.chain === fromChain).id;
            const toAccountId = accounts[walletId][network].find((account: any) => account.chain === toChain).id;

            return { ...item, fromAccountId, toAccountId };
          })
      );
    };

    const history = {
      mainnet: {
        [walletId]: migrateHistory(state, Network.Mainnet, walletId),
      },
      testnet: {
        [walletId]: migrateHistory(state, Network.Testnet, walletId),
      },
    };

    return { ...state, accounts, customTokens, history };
  },
};
