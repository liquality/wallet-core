import { Asset as ChainifyAsset } from '@chainify/types';
import { ChainId, IAsset } from '@liquality/cryptoassets';
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

const parseAsset = (asset: IAsset) => {
  if (asset.type === 'native') {
    return { ...asset, isNative: true }  as any //as ChainifyAsset;
  } else {
    const chainifyAsset = {
      ...asset,
      isNative: false,
    };

    // Avoid mutation on contractAddress to lower case
    switch (asset.chain) {
      case ChainId.Solana:
        return chainifyAsset  as any //as ChainifyAsset;
      default:
        return {
          ...chainifyAsset,
          contractAddress: asset.contractAddress?.toLowerCase(),
        }  as any; //as ChainifyAsset;
    }
  }
};

export const HTLC_CONTRACT_ADDRESS = '0x133713376F69C1A67d7f3594583349DFB53d8166';
