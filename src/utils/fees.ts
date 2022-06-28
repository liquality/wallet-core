import { ChainId, unitToCurrency } from '@liquality/cryptoassets';
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

function getSendFee(asset: Asset, feePrice: number) {
  const assetInfo = cryptoassets[asset];
  const fee = new BN(assetInfo.sendGasLimit).times(feePriceInUnit(asset, feePrice));

  return unitToCurrency(cryptoassets[getNativeAsset(asset)], fee);
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

function isEIP1559Fees(chain: ChainId, network: Network) {
  return (
    chain === ChainId.Ethereum ||
    chain === ChainId.Polygon ||
    (chain === ChainId.Avalanche && network === Network.Mainnet)
  );
}

export { FEE_OPTIONS, getSendFee, getTxFee, getFeeLabel, isEIP1559Fees };
