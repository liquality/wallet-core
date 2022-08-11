import { BitcoinBaseWalletProvider, BitcoinEsploraApiProvider } from '@chainify/bitcoin';
import { Client } from '@chainify/client';
import { EvmUtils } from '@chainify/evm';
import { FeeDetail, FeeDetails } from '@chainify/types';
import { ChainId, currencyToUnit, unitToCurrency } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import store from '../store';
import { AccountId, Asset } from '../store/types';
import { getFeeAsset, getNativeAsset, isERC20, isEthereumChain } from './asset';
import cryptoassets from './cryptoassets';

type FeeUnits = { [asset: Asset]: number };

interface FeeDetailsWithCustom extends FeeDetails {
  custom: FeeDetail;
}

type SendFees = { [speed in keyof FeeDetailsWithCustom]: BN };

function newSendFees(): SendFees {
  return { slow: new BN(0), average: new BN(0), fast: new BN(0), custom: new BN(0) };
}

const FEE_OPTIONS = {
  SLOW: { name: 'Slow', label: 'Slow' },
  AVERAGE: { name: 'Average', label: 'Avg' },
  FAST: { name: 'Fast', label: 'Fast' },
  CUSTOM: { name: 'Custom', label: 'Custom' },
};

const feePriceInUnit = (asset: Asset, feePrice: number) => {
  /*
   * Use the same rounding as in chainify because even slightest difference in calculation might break send max functionality.
   */
  return isEthereumChain(asset) ? EvmUtils.fromGwei(feePrice) : feePrice; // ETH fee price is in gwei
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

async function getSendFeeEstimations(accountId: AccountId, asset: Asset, amount?: BN) {
  const assetChain = cryptoassets[asset]?.chain;
  if (!assetChain) {
    throw new Error(`getSendFeeEstimations: asset chain not available for ${asset}`);
  }

  const feeAsset = getFeeAsset(asset) || getNativeAsset(asset);
  if (!feeAsset) {
    throw new Error(`getSendFeeEstimations: fee asset not available for ${asset}`);
  }

  const suggestedGasFees = store.getters.suggestedGasFees(asset);
  if (!suggestedGasFees) {
    throw new Error(`getSendFeeEstimations: fees not avaibale for ${asset}`);
  }

  if (assetChain === ChainId.Bitcoin) {
    return getFeeEstimationsBTC(accountId, feeAsset, suggestedGasFees, amount);
  } else {
    return getFeeEstimations(feeAsset, suggestedGasFees);
  }
}

/*
 * Fee estimation method for all EIP1559 and non EIP1559 chains
 */
function getFeeEstimations(feeAsset: Asset, suggestedGasFees: FeeDetails, sendFees?: SendFees) {
  const _sendFees = sendFees ?? newSendFees();

  for (const [speed, fee] of Object.entries(suggestedGasFees)) {
    const _speed = speed as keyof FeeDetails;
    /*
     * In case it is EIP1559 chain then `maxFeePerGas` will be set.
     * Otherwise its non EIP1559 (this includes both EVM and Non EVM chains) and calculations are done based on `fee`.
     */
    const _fee: number = fee.fee.maxFeePerGas || fee.fee;

    _sendFees[_speed] = _sendFees[_speed].plus(getSendFee(feeAsset, _fee));
  }

  return _sendFees;
}

/*
 * Fee estimation method for BTC
 */
async function getFeeEstimationsBTC(
  accountId: AccountId,
  feeAsset: Asset,
  suggestedGasFees: FeeDetails,
  amount?: BN,
  sendFees?: SendFees
) {
  if (feeAsset != 'BTC') {
    throw new Error(`getFeeEstimationsBTC: incorrect input asset ${feeAsset}. BTC expected.`);
  }
  const isMax: boolean = amount === undefined; // checking if it is a max send
  const _sendFees = sendFees ?? newSendFees();

  const client = store.getters.client({
    network: store.state.activeNetwork,
    walletId: store.state.activeWalletId,
    asset: feeAsset,
    accountId: accountId,
  }) as Client<BitcoinEsploraApiProvider, BitcoinBaseWalletProvider>;

  const feePerBytes = Object.values(suggestedGasFees).map((fee) => fee.fee);
  const value = isMax ? undefined : currencyToUnit(cryptoassets[feeAsset], amount as BN);

  try {
    const txs = feePerBytes.map((fee) => ({ value, fee }));

    const totalFees = await client.wallet.getTotalFees(txs, isMax);
    for (const [speed, fee] of Object.entries(suggestedGasFees)) {
      const totalFee = unitToCurrency(cryptoassets[feeAsset], totalFees[fee.fee]);
      _sendFees[speed as keyof FeeDetails] = totalFee;
    }
  } catch (e) {
    console.error(e);
  }

  return _sendFees;
}

export { FEE_OPTIONS, getSendFee, getTxFee, getFeeLabel, isEIP1559Fees, getSendFeeEstimations };
