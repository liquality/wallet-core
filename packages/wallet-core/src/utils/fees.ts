import { BitcoinBaseWalletProvider, BitcoinEsploraApiProvider } from '@chainify/bitcoin';
import { Client } from '@chainify/client';
import { EvmUtils } from '@chainify/evm';
import { ChainId, EIP1559Fee, FeeDetail, FeeDetails, FeeType } from '@chainify/types';
import { chains, currencyToUnit, unitToCurrency } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import store from '../store';
import { Account, AccountId, Asset, Network, NFT } from '../store/types';
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

function getSendFee(asset: Asset, feePrice: number, l1FeePrice?: number) {
  const assetInfo = cryptoassets[asset];
  const nativeAsset = cryptoassets[getNativeAsset(asset)];

  if (assetInfo.chain === ChainId.Optimism) {
    if (!l1FeePrice) {
      throw new Error('l1FeePrice must be specified for Optimism');
    }

    let l1Fee = new BN(assetInfo.sendGasLimitL1 as number).times(feePriceInUnit(asset, l1FeePrice));

    // TODO: check if you can fetch scalar
    // default scalar for L1 fee in Optimism mainnet -> 1, testnet 1.5
    if (store.state.activeNetwork === Network.Testnet) {
      l1Fee = l1Fee.times(new BN(1.5));
    }

    const l2Fee = new BN(assetInfo.sendGasLimit).times(feePriceInUnit(asset, feePrice));
    return unitToCurrency(nativeAsset, l1Fee.plus(l2Fee));
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

function isEIP1559Fees(chain: ChainId) {
  return chain === ChainId.Ethereum || chain === ChainId.Polygon || chain === ChainId.Avalanche;
}

/*
 * Probable fee for EIP1559 (BASE + TIP)
 */
function probableFeePerUnitEIP1559(suggestedGasFee: EIP1559Fee) {
  if (suggestedGasFee.suggestedBaseFeePerGas === undefined) {
    return suggestedGasFee.maxPriorityFeePerGas;
  }

  return suggestedGasFee.suggestedBaseFeePerGas + suggestedGasFee.maxPriorityFeePerGas;
}

/*
 * Max fee for EIP1559
 */
function maxFeePerUnitEIP1559(suggestedGasFee: EIP1559Fee) {
  return suggestedGasFee.maxFeePerGas;
}

/*
 * Calculates fee for EIP1559 or returns fee for non EIP1559 chains per gas or byte (unit)
 */
function feePerUnit(suggestedGasFee: FeeType, chain: ChainId): number {
  if (suggestedGasFee === undefined || chain === undefined) {
    throw new Error('feePerUnit: Incorrect input!');
  }

  /*
   * In case it is EIP1559 chain then `maxFeePerGas` will be set.
   * Otherwise its non EIP1559 (this includes both EVM and Non EVM chains) and calculations are done based on `fee`.
   */
  if (!isEIP1559Fees(chain) && typeof suggestedGasFee === 'number') {
    return suggestedGasFee as number;
  }

  if (isEIP1559Fees(chain) && typeof suggestedGasFee === 'object') {
    return maxFeePerUnitEIP1559(suggestedGasFee as EIP1559Fee);
  }

  throw new Error('feePerUnit: suggestedGasFee deos not match chain!');
}

async function getSendTxFees(accountId: AccountId, asset: Asset, amount?: BN, customFee?: FeeType) {
  const assetChain = cryptoassets[asset]?.chain;
  if (!assetChain) {
    throw new Error(`getSendFeeEstimations: asset chain not available for ${asset}`);
  }

  const feeAsset = getFeeAsset(asset) || getNativeAsset(asset);
  if (!feeAsset) {
    throw new Error(`getSendFeeEstimations: fee asset not available for ${asset}`);
  }

  const suggestedGasFees = store.getters.suggestedFeePrices(feeAsset);
  if (!suggestedGasFees) {
    throw new Error(`getSendFeeEstimations: fees not avaibale for ${feeAsset}`);
  }

  const _suggestedGasFees = suggestedGasFees as FeeDetailsWithCustom;
  if (customFee) {
    _suggestedGasFees.custom = { fee: customFee };
  }

  if (assetChain === ChainId.Bitcoin) {
    return sendBitcoinTxFees(accountId, feeAsset, _suggestedGasFees, amount);
  } else {
    return sendTxFeesInNativeAsset(feeAsset, _suggestedGasFees);
  }
}

/*
 * Send fee estimation method for all EIP1559 and non EIP1559 chains
 */
function sendTxFeesInNativeAsset(feeAsset: Asset, suggestedGasFees: FeeDetailsWithCustom, sendFees?: SendFees) {
  const assetChain = cryptoassets[feeAsset]?.chain;
  const _sendFees = sendFees ?? newSendFees();

  for (const [speed, fee] of Object.entries(suggestedGasFees)) {
    const _speed = speed as keyof FeeDetailsWithCustom;

    const _fee: number = feePerUnit(fee.fee, assetChain);

    _sendFees[_speed] = _sendFees[_speed].plus(getSendFee(feeAsset, _fee, fee.multilayerFee?.l1));
  }

  return _sendFees;
}

/*
 * Send fee estimation method for BTC
 */
async function sendBitcoinTxFees(
  accountId: AccountId,
  feeAsset: Asset,
  suggestedGasFees: FeeDetailsWithCustom,
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
      _sendFees[speed as keyof FeeDetailsWithCustom] = totalFee;
    }
  } catch (e) {
    console.error(e);
  }

  return _sendFees;
}

async function estimateTransferNFT(
  accountId: AccountId,
  receiver: string,
  values: number[],
  nft: NFT,
  customFee?: FeeType
): Promise<SendFees> {
  const account: Account = store.getters.accountItem(accountId)!;

  const feeAsset = chains[account.chain].nativeAsset;
  if (!feeAsset) {
    throw new Error(`getSendFeeEstimations: fee asset not available`);
  }

  const suggestedGasFees = store.getters.suggestedFeePrices(feeAsset);
  if (!suggestedGasFees) {
    throw new Error(`getSendFeeEstimations: fees not avaibale for ${feeAsset}`);
  }

  const _suggestedGasFees = suggestedGasFees as FeeDetailsWithCustom;
  if (customFee) {
    _suggestedGasFees.custom = { fee: customFee };
  }

  const client = store.getters.client({
    network: store.state.activeNetwork,
    walletId: store.state.activeWalletId,
    asset: feeAsset,
    accountId: accountId,
  });

  let _receiver = receiver;
  // create a placeholder fro receiver address in case it is not specified
  // only for EVM chains
  if (!receiver && isEthereumChain(feeAsset)) {
    _receiver = '0x' + 'f'.repeat(40);
  }

  const _sendFees = newSendFees();
  try {
    const estimation = await client.nft.estimateTransfer(
      nft.asset_contract!.address!,
      _receiver,
      [nft.token_id!],
      values
    );

    for (const [speed, fee] of Object.entries(suggestedGasFees)) {
      const _speed = speed as keyof FeeDetailsWithCustom;
      const _fee: number = feePerUnit(fee.fee, account.chain);
      _sendFees[_speed] = new BN(estimation).times(_fee).div(1e9);
    }

    return _sendFees;
  } catch (e) {
    // in case method is not implemented (like in Solana), return fee without estimations
    if (e.name === 'UnsupportedMethodError') {
      for (const [speed, fee] of Object.entries(suggestedGasFees)) {
        const _speed = speed as keyof FeeDetailsWithCustom;
        _sendFees[_speed] = new BN(feePerUnit(fee.fee, account.chain));
      }

      return _sendFees;
    }

    throw e;
  }
}

export {
  FEE_OPTIONS,
  getSendFee,
  getTxFee,
  getFeeLabel,
  isEIP1559Fees,
  getSendTxFees,
  sendTxFeesInNativeAsset,
  sendBitcoinTxFees,
  probableFeePerUnitEIP1559,
  maxFeePerUnitEIP1559,
  feePerUnit,
  newSendFees,
  estimateTransferNFT,
};
