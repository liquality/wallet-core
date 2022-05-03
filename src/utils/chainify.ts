import { Asset } from '@chainify/types';
import cryptoassets from './cryptoassets';

export function assetsAdapter(assets: string | string[]): Asset[] {
  if (assets instanceof Array) {
    return assets.map((a) => {
      const _asset = cryptoassets[a];
      return { ..._asset, isNative: _asset.type === 'native' };
    }) as Asset[];
  } else {
    const _asset = cryptoassets[assets];
    return [{ ..._asset, isNative: _asset.type === 'native' }] as Asset[];
  }
}

export const HTLC_CONTRACT_ADDRESS = '0x133713376F69C1A67d7f3594583349DFB53d8166';
