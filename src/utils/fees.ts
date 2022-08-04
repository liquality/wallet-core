import { BitcoinBaseWalletProvider, BitcoinEsploraApiProvider } from '@chainify/bitcoin';
import { Client } from '@chainify/client';
import { FeeDetails } from '@chainify/types';
import { ChainId, currencyToUnit, unitToCurrency } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import store from '../store';
import { AccountId, Asset } from '../store/types';
import { getFeeAsset, getNativeAsset, isERC20, isEthereumChain } from './asset';
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

function isEIP1559Fees(chain: ChainId) {
  return chain === ChainId.Ethereum || chain === ChainId.Polygon || chain === ChainId.Avalanche;
}


async function getSendAmountFee(accountId: AccountId, asset: Asset, amount?: BN) {
  const getMax = amount === undefined
  const sendFees: {
    [speed in keyof FeeDetails]: BN
  } = { slow: new BN(0), average: new BN(0), fast: new BN(0), }

  const assetFees = store.getters.assetFees(asset);
  const feeAsset = getFeeAsset(asset) || getNativeAsset(asset)
  if (assetFees) {
    for (const [speed, fee] of Object.entries(assetFees)) {
      const feePrice = fee.fee.maxPriorityFeePerGas + fee.fee.suggestedBaseFeePerGas || fee.fee
      sendFees[speed as keyof FeeDetails] = getSendFee(feeAsset, feePrice)
    }
    if (asset === 'BTC') {
      const client = store.getters.client({
        network: store.state.activeNetwork,
        walletId: store.state.activeWalletId,
        asset: asset,
        accountId: accountId
      }) as Client<
        BitcoinEsploraApiProvider,
        BitcoinBaseWalletProvider
      >;
      const feePerBytes = Object.values(assetFees).map((fee) => fee.fee)
      const value = getMax ? undefined : currencyToUnit(cryptoassets[asset], amount)
      try {
        const txs = feePerBytes.map((fee) => ({ value, fee }))

        const totalFees = await client.wallet.getTotalFees(txs, getMax)
        for (const [speed, fee] of Object.entries(assetFees)) {
          const totalFee = unitToCurrency(cryptoassets[asset], totalFees[fee.fee])
          sendFees[speed as keyof FeeDetails] = totalFee
        }
      } catch (e) {
        console.error(e)
      }
    }

    return sendFees
  }
}

export { FEE_OPTIONS, getSendFee, getTxFee, getFeeLabel, isEIP1559Fees, getSendAmountFee };
