import { ChainId } from '@chainify/types';
import { isMultiLayeredChain, unitToCurrency } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import { Asset, Network } from '../store/types';
import { getNativeAsset, isERC20, isEthereumChain } from './asset';
import cryptoassets from './cryptoassets';

type FeeUnits = { [asset: Asset]: number };

const FEE_OPTIONS = {
  SLOW: { name: 'Slow', label: 'Slow' },
  AVERAGE: { name: 'Average', label: 'Avg' },
  FAST: { name: 'Fast', label: 'Fast' },
  CUSTOM: { name: 'Custom', label: 'Custom' },
};

const feePriceInUnit = (asset: Asset, feePrice: number) => {
  return isEthereumChain(asset) ? new BN(feePrice).times(1e9) : feePrice; // ETH fee price is in gwei
};

function getSendFee(asset: Asset, feePrice: number, l1FeePrice?: number, network?: Network) {
  const assetInfo = cryptoassets[asset];
  const nativeAsset = cryptoassets[getNativeAsset(asset)];

  if (l1FeePrice && isMultiLayeredChain(assetInfo.chain)) {
    if (assetInfo.chain === ChainId.Optimism) {
      let l1Fee = new BN(assetInfo.sendGasLimitL1 as number).times(feePriceInUnit(asset, l1FeePrice));

      // default scalar for L1 fee in Optimism mainnet -> 1, testnet 1.5
      if (network && network === 'testnet') l1Fee = l1Fee.times(new BN(1.5));

      const l2Fee = new BN(assetInfo.sendGasLimit).times(feePriceInUnit(asset, feePrice));
      return unitToCurrency(nativeAsset, l1Fee.plus(l2Fee));
    }
  } else {
    const fee = new BN(assetInfo.sendGasLimit).times(feePriceInUnit(asset, feePrice));
    return unitToCurrency(nativeAsset, fee);
  }
}

function getTxFee(units: FeeUnits, _asset: Asset, _feePrice: number) {
  const chainId = cryptoassets[_asset].chain;
  const asset = isERC20(_asset) ? 'ERC20' : _asset;
  const feeUnits = chainId === 'terra' ? units['LUNA'] : units[asset]; // Terra ERC20 assets use gas equal to Terra Native assets
  const fee = new BN(feeUnits).times(feePriceInUnit(_asset, _feePrice));

  return unitToCurrency(cryptoassets[getNativeAsset(_asset)], fee);
}

function getFeeLabel(fee: string) {
  const name = (fee?.toUpperCase() || '') as keyof typeof FEE_OPTIONS;
  return FEE_OPTIONS[name]?.label || '';
}

export { FEE_OPTIONS, getSendFee, getTxFee, getFeeLabel };
