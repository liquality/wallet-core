import arbitrumTokens from './arbitrum-tokens';
import avalancheTokens from './avalanche-tokens';
import ethereumTokens from './ethereum-tokens';
import optimismTokens from './optimism-tokens';
import polygonTokens from './polygon-tokens';
import rskTokens from './rsk-tokens';
import solanaTokens from './solana-tokens';
import terraTokens from './terra-tokens';

import { AssetMap } from '../../../types';
import { transformChainToTokenAddress } from '../../utils';

const MAINNET_ERC20_ASSETS: AssetMap = {
  ...arbitrumTokens,
  ...avalancheTokens,
  ...ethereumTokens,
  ...optimismTokens,
  ...polygonTokens,
  ...rskTokens,
  ...solanaTokens,
  ...terraTokens,
};

const CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP = transformChainToTokenAddress(MAINNET_ERC20_ASSETS);

export { MAINNET_ERC20_ASSETS, CHAIN_TO_MAINNET_TOKEN_ADDRESS_MAP };
