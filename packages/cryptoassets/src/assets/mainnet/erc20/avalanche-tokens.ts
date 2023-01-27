import { ChainId } from '../../../types';
import { transformTokenMap } from '../../utils';

const TOKENS = {
  'WBTC.e': {
    name: 'Wrapped BTC (WBTC.e) Avax',
    code: 'WBTC.e',
    decimals: 8,
    contractAddress: '0x50b7545627a5162f82a992c33b87adc75187b218',
    color: '#5b3159',
    matchingAsset: 'WBTC',
  },
  'WETH.e': {
    name: 'Wrapped Ether (WETH.e) Avax',
    code: 'WETH.e',
    decimals: 18,
    contractAddress: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
    color: '#5b3159',
    matchingAsset: 'WETH',
  },
  'USDC.e': {
    name: 'USD Coin (USDC.e) Avax',
    code: 'USDC.e',
    decimals: 6,
    contractAddress: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
    color: '#5b31b9',
    matchingAsset: 'USDC',
  },
  'USDT.e': {
    name: 'Tether USD (USDT.e) Avax',
    code: 'USDT.e',
    decimals: 6,
    contractAddress: '0xc7198437980c041c805a1edcba50c1ce5db95118',
    color: '#5b31f9',
    matchingAsset: 'USDT',
  },
  'USDT.avax': {
    name: 'TetherToken (USDt) Avax',
    code: 'USDT.avax',
    decimals: 6,
    contractAddress: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
    color: '#5b31f9',
    matchingAsset: 'USDT',
  },
  'USDC.avax': {
    name: 'USD Coin (USDC) Avax',
    code: 'USDC.avax',
    decimals: 6,
    contractAddress: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    color: '#5b31b9',
    matchingAsset: 'USDC',
  },
};
export default transformTokenMap(TOKENS, ChainId.Avalanche);
