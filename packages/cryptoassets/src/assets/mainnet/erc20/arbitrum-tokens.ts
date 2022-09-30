import { ChainId } from '../../../types';
import { transformTokenMap } from '../../utils';

const TOKENS = {
  ARBUSDC: {
    name: 'Arbitrum USD Coin',
    code: 'ARBUSDC',
    decimals: 6,
    contractAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    color: '#5b31b9',
    matchingAsset: 'USDC',
  },
  ARBUSDT: {
    name: 'Arbitrum Tether USD',
    code: 'ARBUSDT',
    decimals: 6,
    contractAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    color: '#5b31f9',
    matchingAsset: 'USDT',
  },
  ARBDAI: {
    name: 'Arbitrum DAI',
    code: 'ARBDAI',
    decimals: 18,
    contractAddress: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    color: '#3b31a9',
    matchingAsset: 'DAI',
  },
};

export default transformTokenMap(TOKENS, ChainId.Arbitrum);
