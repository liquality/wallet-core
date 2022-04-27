import { Asset } from '@liquality/types';
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
