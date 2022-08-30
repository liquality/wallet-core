import { ChainId } from '../../../types';
import { transformTokenMap } from '../../utils';

const TOKENS = {
  'WBTC.e': {
    name: 'Avax Wrapped Bitcoin',
    code: 'WBTC.e',
    decimals: 8,
    contractAddress: '0x50b7545627a5162f82a992c33b87adc75187b218',
    color: '#5b3159',
    matchingAsset: 'WBTC',
    priceSource: {
      coinGeckoId: 'wrapped-bitcoin',
    },
  },
  'USDC.e': {
    name: 'Avax USD Coin',
    code: 'USDC.e',
    decimals: 6,
    contractAddress: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
    color: '#5b31b9',
    matchingAsset: 'USDC',
    priceSource: {
      coinGeckoId: 'usd-coin',
    },
  },
  'USDT.e': {
    name: 'Avax Tether USD',
    code: 'USDT.e',
    decimals: 6,
    contractAddress: '0xc7198437980c041c805a1edcba50c1ce5db95118',
    color: '#5b31f9',
    matchingAsset: 'USDT',
    priceSource: {
      coinGeckoId: 'tether',
    },
  },
};
export default transformTokenMap(TOKENS, ChainId.Avalanche);
