import { Asset as ChainifyAsset } from '@chainify/types';
import { Asset, ChainId } from '@liquality/cryptoassets';
import cryptoassets from './cryptoassets';

export function assetsAdapter(assets: string | string[]): ChainifyAsset[] {
  if (assets instanceof Array) {
    return assets.map((a) => parseAsset(cryptoassets[a]));
  } else {
    return [parseAsset(cryptoassets[assets])];
  }
}

const parseAsset = (asset: Asset) => {
  if (asset.type === 'native') {
    return { ...asset, isNative: true } as ChainifyAsset;
  } else {
    const chainifyAsset = {
      ...asset,
      isNative: false,
    };

    // Avoid mutation on contractAddress to lower case
    switch (asset.chain) {
      case ChainId.Solana:
        return chainifyAsset as ChainifyAsset;
      default:
        return {
          ...chainifyAsset,
          contractAddress: asset.contractAddress?.toLowerCase(),
        } as ChainifyAsset;
    }
  }
};

export const HTLC_CONTRACT_ADDRESS = '0x133713376F69C1A67d7f3594583349DFB53d8166';
