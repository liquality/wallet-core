import { ChainId } from '../../../types';
import { transformTokenMap } from '../../utils';

const TOKENS = {
  PWETH: {
    name: 'Polygon Wrapped Ether',
    code: 'PWETH',
    decimals: 18,
    contractAddress: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
    color: '#5b3159',
    matchingAsset: 'WETH',
    priceSource: {
      coinGeckoId: 'weth',
    },
  },
};

export default transformTokenMap(TOKENS, ChainId.Polygon);
