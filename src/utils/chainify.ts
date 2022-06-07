import { Asset as ChainifyAsset } from '@chainify/types';
import { Asset } from '@liquality/cryptoassets';
import cryptoassets from './cryptoassets';

export function assetsAdapter(assets: string | string[]): ChainifyAsset[] {
  if (assets instanceof Array) {
    return assets.reduce((result, asset) => {
      if (cryptoassets[asset]) {
        result.push(parseAsset(cryptoassets[asset]));
      }
      return result;
    }, [] as ChainifyAsset[]);
  } else {
    const result = [];
    if (cryptoassets[assets]) {
      result.push(parseAsset(cryptoassets[assets]));
    }
    return result;
  }
}

const parseAsset = (asset: Asset) => {
  if (asset.type === 'native') {
    return { ...asset, isNative: true } as ChainifyAsset;
  } else {
    return { ...asset, isNative: false, contractAddress: asset.contractAddress?.toLowerCase() } as ChainifyAsset;
  }
};

export const HTLC_CONTRACT_ADDRESS = '0x133713376F69C1A67d7f3594583349DFB53d8166';
