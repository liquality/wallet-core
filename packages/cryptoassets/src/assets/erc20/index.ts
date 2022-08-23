import { mapValues, transform } from 'lodash';

import arbitrumTokens from './arbitrum-tokens.json';
import avalancheTokens from './avalanche-tokens.json';
import ethereumTokens from './ethereum-tokens.json';
import polygonTokens from './polygon-tokens.json';
import rskTokens from './rsk-tokens.json';
import solanaTokens from './solana-tokens.json';
import terraTokens from './terra-tokens.json';

import { Asset, AssetMap, AssetType, ChainId } from '../../types';
import { TESTNET_CONTRACT_ADDRESSES, TESTNET_TOKENS } from '../testnet/native';

const rskTokensData = mapValues(rskTokens, (tokenData) => ({
  ...tokenData,
  chain: ChainId.Rootstock,
}));

const ethereumTokensData = mapValues(ethereumTokens, (tokenData) => ({
  ...tokenData,
  chain: ChainId.Ethereum,
}));

const polygonTokensData = mapValues(polygonTokens, (tokenData) => ({
  ...tokenData,
  chain: ChainId.Polygon,
}));

const avalancheTokensData = mapValues(avalancheTokens, (tokenData) => ({
  ...tokenData,
  chain: ChainId.Avalanche,
}));

const terraTokensData = mapValues(terraTokens, (tokenData) => ({
  ...tokenData,
  chain: ChainId.Terra,
}));

const arbitrumTokensData = mapValues(arbitrumTokens, (tokenData) => ({
  ...tokenData,
  chain: ChainId.Arbitrum,
}));

const solanaTokensData = mapValues(solanaTokens, (tokenData) => ({
  ...tokenData,
  chain: ChainId.Solana,
}));

const erc20Assets: AssetMap = mapValues(
  {
    ...rskTokensData,
    ...ethereumTokensData,
    ...polygonTokensData,
    ...terraTokensData,
    ...avalancheTokensData,
    ...arbitrumTokensData,
    ...solanaTokensData,
  },
  (tokenData) => ({
    ...tokenData,
    type: 'erc20' as AssetType,
  })
);

const testnetErc20Assets = TESTNET_TOKENS.reduce((assets: AssetMap, asset: string) => {
  return Object.assign(assets, {
    [asset]: {
      ...erc20Assets[asset],
      contractAddress: TESTNET_CONTRACT_ADDRESSES[asset],
    },
  });
}, {});

const transformAssetMap = (tokens: AssetMap) =>
  transform(tokens, (result: { [chain: string]: AssetMap }, value: Asset) => {
    return value.chain && (result[value.chain] = { ...result[value.chain], [String(value.contractAddress)]: value });
  });

const chainToTokenAddressMap = transformAssetMap(erc20Assets);
const chainToTestnetTokenAddressMap = transformAssetMap(testnetErc20Assets);

export { erc20Assets, testnetErc20Assets, chainToTokenAddressMap, chainToTestnetTokenAddressMap };
