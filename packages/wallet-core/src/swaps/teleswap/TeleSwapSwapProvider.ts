import { BitcoinBaseWalletProvider, BitcoinEsploraApiProvider } from '@chainify/bitcoin';
import { Client } from '@chainify/client';
// HttpClient
import { Transaction } from '@chainify/types';
import { unitToCurrency, getChain } from '@liquality/cryptoassets';
// currencyToUnit  ChainId
// import { getErrorParser, ThorchainAPIErrorParser } from '@liquality/error-parser';
import { isTransactionNotFoundError } from '../../utils/isTransactionNotFoundError';
// import ERC20 from '@uniswap/v2-core/build/ERC20.json';
import UniswapV2Factory from '@uniswap/v2-core/build/UniswapV2Factory.json';
// import { BaseAmount, baseAmount, } from '@xchainjs/xchain-util';
// baseToAsset assetFromString
import BN, { BigNumber } from 'bignumber.js';
import * as ethers from 'ethers';
import { mapValues } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import buildConfig from '../../build.config';
import store, { ActionContext } from '../../store';
import { withInterval, withLock } from '../../store/actions/performNextAction/utils';
import { Asset, Network, SwapHistoryItem, WalletId } from '../../store/types';
// import { isERC20 } from '../../utils/asset';
import { fiatToCrypto, prettyBalance } from '../../utils/coinFormatter';
import cryptoassets from '../../utils/cryptoassets';
// import { getTxFee } from '../../utils/fees';
import { SwapProvider } from '../SwapProvider';
import { calculateFee, getLockers } from '@sinatdt/scripts'; // TODO package name
import { TeleportDaoPayment} from "@sinatdt/bitcoin"; // TODO package name

import {
	BaseSwapProviderConfig,
	EstimateFeeRequest,
	// EstimateFeeResponse,
	NextSwapActionRequest,
	QuoteRequest,
	SwapQuote,
	SwapRequest,
	SwapStatus,
} from '../types';
import { CUSTOM_ERRORS, createInternalError } from '@liquality/error-parser';

const TRANSFER_APP_ID = 0;
const EXCHANGE_APP_ID = 1;
const SUGGESTED_DEADLINE = 100000000; // TODO: EDIT IT
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const PROTOCOL_FEE = 20; // locker fee (%0.15) + protocol fee (%0.05)
const SLIPPAGE = 10; // TODO: EDIT IT

export interface TeleSwapSwapProviderConfig extends BaseSwapProviderConfig {
	QuickSwapRouterAddress: string;
	QuickSwapFactoryAddress: string;
}

// const SUPPORTED_CHAINS = [ChainId.Bitcoin, ChainId.Ethereum];

/**
 * Converts a `BaseAmount` string into `PoolData` balance (always `1e8` decimal based)
 */
// const toPoolBalance = (baseAmountString: string) => baseAmount(baseAmountString, THORCHAIN_DECIMAL);

// TODO: this needs to go into cryptoassets. In fact, we should have large compatibility with the chain.asset notation
// Probably cryptoassets should adopt that kind of naming for assets
// const toThorchainAsset = (asset: Asset) => {
//   return isERC20(asset) ? `ETH.${asset}-${cryptoassets[asset].contractAddress!.toUpperCase()}` : `${asset}.${asset}`;
// };

/**
 * Helper to convert decimal of asset amounts
 *
 * It can be used to convert Midgard/THORChain amounts,
 * which are always based on 1e8 decimal into any 1e(n) decimal
 *
 * Examples:
 * ETH.ETH: 1e8 -> 1e18
 * ETH.USDT: 1e8 -> 1e6
 *
 * @param amount BaseAmount to convert
 * @param decimal Target decimal
 */
// const convertBaseAmountDecimal = (amount: BaseAmount, decimal: number) => {
//   const decimalDiff = decimal - amount.decimal;

//   const amountBN =
//     decimalDiff < 0
//       ? amount
//           .amount()
//           .dividedBy(new BN(10 ** (decimalDiff * -1)))
//           // Never use `BigNumber`s with decimal within `BaseAmount`
//           // that's why we need to set `decimalPlaces` to `0`
//           // round down is needed to make sure amount of currency is still available
//           // without that, `dividedBy` might round up and provide an currency amount which does not exist
//           .decimalPlaces(0, BN.ROUND_DOWN)
//       : amount.amount().multipliedBy(new BN(10 ** decimalDiff));
//   return baseAmount(amountBN, decimal);
// };

export interface ThorchainPool {
	balance_rune: string;
	balance_asset: string;
	asset: string;
	LP_units: string;
	pool_units: string;
	status: string;
	synth_units: string;
	synth_supply: string;
	pending_inbound_rune: string;
	pending_inbound_asset: string;
}

export interface ThorchainTx {
	id: string;
	chain: string;
	from_address: string;
	to_address: string;
	coins: {
		asset: string;
		amount: string;
	}[];
	gas: {
		asset: string;
		amount: string;
	}[];
	memo: string;
}

export interface ThorchainObservedTx {
	tx: ThorchainTx;
	status: string;
	block_height: number;
	signers: string[];
	observed_pub_key: string;
	finalise_height: number;
	out_hashes: string[];
}

export interface ThorchainTransactionResponse {
	keysign_metric: {
		tx_id: string;
		node_tss_times?: any;
	};
	observed_tx: ThorchainObservedTx;
}

export enum TeleSwapTxTypes {
	WRAP = 'WRAP',
	SWAP = 'SWAP',
}

export interface TeleSwapSwapHistoryItem extends SwapHistoryItem {
	receiveFee: string;
	approveTxHash: string;
	approveTx: Transaction;
	fromFundHash: string;
	fromFundTx: Transaction;
	receiveTxHash: string;
	receiveTx: Transaction;
}

export interface ThorchainSwapQuote extends SwapQuote {
	receiveFee: string;
	slippage: number;
}

class TeleSwapSwapProvider extends SwapProvider {
	
	config: TeleSwapSwapProviderConfig;
	
	constructor(config: TeleSwapSwapProviderConfig) {
		super(config);
	}

	async getSupportedPairs() {
		return [];
	}

	async getQuote(quoteRequest: QuoteRequest) {
		// const { from, to, amount, network } = quoteRequest;
		// TODO: EDIT IT
		return {
		fromAmount: quoteRequest.amount.toFixed(),
		toAmount: quoteRequest.amount.toFixed(),
		slippage: quoteRequest.amount, // Convert to bips
		};
		// // Only ethereum, bitcoin and bc chains are supported
		// if (!SUPPORTED_CHAINS.includes(cryptoassets[from].chain) || !SUPPORTED_CHAINS.includes(cryptoassets[to].chain))
		//   return null;

		// // Slippage must be higher for small value swaps
		// const min = await this.getMin(quoteRequest);
		// const slippage = new BN(amount).gt(min.times(2)) ? 0.03 : 0.05;

		// const fromAmountInUnit = currencyToUnit(cryptoassets[from], new BN(amount));
		// const toAmountInUnit = await this.getOutput({ from, to, fromAmountInUnit, slippage, network });

		// if (!toAmountInUnit) {
		//   return null;
		// }

		// return {
		//   fromAmount: fromAmountInUnit.toFixed(),
		//   toAmount: toAmountInUnit.toFixed(),
		//   slippage: slippage * 1000, // Convert to bips
		// };
	}

	async sendBitcoinSwap({
		quote,
		network,
		walletId,
		// memo,
	}: {
		quote: TeleSwapSwapHistoryItem;
		network: Network;
		walletId: WalletId;
		// memo: string;
	}) {
		// send notif to ledger
		await this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');

		// find the best locker (is active and has capacity)
		const to = await this._chooseLockerAddress(Number(quote.fromAmount), network);

		// input amount
		const value = new BN(quote.fromAmount);

		// determine req type (wrap or swap)
		const requestType = quote.to === "TeleBTC"? TeleSwapTxTypes.WRAP: TeleSwapTxTypes.SWAP;

		// get receipient address 
		const fromAddressRaw = await this.getSwapAddress(network, walletId, quote.from, quote.toAccountId);
		// const fromAddress = getChain(network, fromChain).formatAddress(fromAddressRaw);

		// get OP_RETURN data
		const opReturnData = await this._getOpReturnData(quote, requestType, network, fromAddressRaw);

		// get client to sign tx
		const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
		const fromFundTx = await client.wallet.sendTransaction({
		to: to,
		value,
		data: opReturnData,
		fee: quote.fee, // TODO: is it bitcoin tx fee?
		});
		return fromFundTx;
	}

	async sendSwap({ network, walletId, swap }: NextSwapActionRequest<TeleSwapSwapHistoryItem>) {
		// const memo = await this.makeMemo({ network, walletId, swap });
		let fromFundTx;
		if (swap.from === 'BTC') {
		fromFundTx = await this.sendBitcoinSwap({
			quote: swap,
			network,
			walletId,
			// memo,
		});
		}

		if (!fromFundTx) {
		throw createInternalError(CUSTOM_ERRORS.FailedAssert.SendTransaction);
		}

		return {
		status: 'WAITING_FOR_SEND_CONFIRMATIONS',
		fromFundTx,
		fromFundHash: fromFundTx.hash,
		};
	}

	async newSwap({ network, walletId, quote }: SwapRequest<TeleSwapSwapHistoryItem>) {

		const updates = this.sendSwap({ network, walletId, swap: quote })

		return {
			id: uuidv4(),
			fee: quote.fee,
			...updates,
		};
	}

	async estimateFees({
		network,
		walletId,
		asset,
		txType,
		quote,
		feePrices,
		max,
	}: EstimateFeeRequest<TeleSwapTxTypes, ThorchainSwapQuote>) {
		if (txType === this._txTypes().SWAP && asset === 'BTC') {
			const client = this.getClient(network, walletId, asset, quote.fromAccountId) as Client<
				BitcoinEsploraApiProvider,
				BitcoinBaseWalletProvider
			>;
			const value = max ? undefined : new BN(quote.fromAmount);
			// const memo = await this.makeMemo({ network, walletId, swap: quote });
			// const encodedMemo = Buffer.from(memo, 'utf-8').toString('hex');
			const txs = feePrices.map((fee) => ({ to: '', value, fee }));
			const totalFees = await client.wallet.getTotalFees(txs, max);
			return mapValues(totalFees, (f) => unitToCurrency(cryptoassets[asset], f));
		}

		// if (txType in this.feeUnits) {
		//   const fees: EstimateFeeResponse = {};
		//   for (const feePrice of feePrices) {
		//     fees[feePrice] = getTxFee(this.feeUnits[txType], asset, feePrice);
		//   }
		//   return fees;
		// }

		return null;
	}

	async getMin(quote: QuoteRequest) {
		const fiatRates = store.state.fiatRates;
		let min = new BN('0');
		if (fiatRates && fiatRates[quote.from]) {
		min = new BN(fiatToCrypto(200, fiatRates[quote.from]));
		}
		return min;
	}

	// return address of asset
	getTokenAddress(asset: Asset) {
		return cryptoassets[asset].contractAddress;
	}

	async waitForApproveConfirmations({ swap, network, walletId }: NextSwapActionRequest<TeleSwapSwapHistoryItem>) {
		const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);

		try {
		const tx = await client.chain.getTransactionByHash(swap.approveTxHash);

		if (tx && tx.confirmations && tx.confirmations > 0) {
			return {
			endTime: Date.now(),
			status: 'APPROVE_CONFIRMED',
			};
		}
		} catch (e) {
		if (isTransactionNotFoundError(e)) console.warn(e);
		else throw e;
		}
	}

	async waitForSendConfirmations({ swap, network, walletId }: NextSwapActionRequest<TeleSwapSwapHistoryItem>) {
		const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);

		try {
		const tx = await client.chain.getTransactionByHash(swap.fromFundHash);
		if (tx && tx.confirmations && tx.confirmations > 0) {
			return {
			endTime: Date.now(),
			status: 'WAITING_FOR_RECEIVE',
			};
		}
		} catch (e) {
		if (isTransactionNotFoundError(e)) console.warn(e);
		else throw e;
		}
	}

	async waitForReceive({ swap, network, walletId }: NextSwapActionRequest<TeleSwapSwapHistoryItem>) {
		if (swap) {}
		if (network) {}
		if (walletId) {}
		// try {
		//   const thorchainTx = await this._getTransaction(swap.fromFundHash);
		//   if (thorchainTx) {
		//     const receiveHash = thorchainTx.observed_tx.out_hashes?.[0];
		//     if (receiveHash) {
		//       const thorchainReceiveTx = await this._getTransaction(receiveHash);
		//       if (thorchainReceiveTx) {
		//         const memo = thorchainReceiveTx.observed_tx?.tx?.memo;
		//         const memoAction = memo.split(':')[0];

		//         let asset;
		//         let accountId;
		//         if (memoAction === 'OUT') {
		//           asset = swap.to;
		//           accountId = swap.toAccountId;
		//         } else if (memoAction === 'REFUND') {
		//           asset = swap.from;
		//           accountId = swap.fromAccountId;
		//         } else {
		//           throw createInternalError(CUSTOM_ERRORS.Invalid.ThorchainMemoAction(memoAction));
		//         }

		//         const client = this.getClient(network, walletId, asset, accountId);
		//         const receiveTx = await client.chain.getTransactionByHash(receiveHash);
		//         if (receiveTx && receiveTx.confirmations && receiveTx.confirmations > 0) {
		//           this.updateBalances(network, walletId, [accountId]);
		//           const status = OUT_MEMO_TO_STATUS[memoAction];
		//           return {
		//             receiveTxHash: receiveTx.hash,
		//             receiveTx: receiveTx,
		//             endTime: Date.now(),
		//             status,
		//           };
		//         } else {
		//           return {
		//             receiveTxHash: receiveTx.hash,
		//             receiveTx: receiveTx,
		//           };
		//         }
		//       }
		//     }
		//   }
		// } catch (e) {
		//   console.error(`Thorchain waiting for receive failed ${swap.fromFundHash}`, e);
		// }
	}

	async performNextSwapAction(
		store: ActionContext,
		{ network, walletId, swap }: NextSwapActionRequest<TeleSwapSwapHistoryItem>
	) {
		switch (swap.status) {
		case 'WAITING_FOR_APPROVE_CONFIRMATIONS':
			return withInterval(async () => this.waitForApproveConfirmations({ swap, network, walletId }));
		case 'APPROVE_CONFIRMED':
			return withLock(store, { item: swap, network, walletId, asset: swap.from }, async () =>
			this.sendSwap({ swap, network, walletId })
			);
		case 'WAITING_FOR_SEND_CONFIRMATIONS':
			return withInterval(async () => this.waitForSendConfirmations({ swap, network, walletId }));
		case 'WAITING_FOR_RECEIVE':
			return withInterval(async () => this.waitForSendConfirmations({ swap, network, walletId }));
			// return withInterval(async () => this.waitForReceive({ swap, network, walletId }));
		}
	}

	// private feeUnits = {
	//   [TeleSwapTxTypes.SWAP]: {
	//     ETH: 200000,
	//     BNB: 200000,
	//     MATIC: 200000,
	//     ERC20: 100000 + 200000, // (potential)ERC20 Approval + Swap
	//   },
	// };

	protected _getStatuses(): Record<string, SwapStatus> {
		return {
		WAITING_FOR_APPROVE_CONFIRMATIONS: {
			step: 0,
			label: 'Approving {from}',
			filterStatus: 'PENDING',
			notification(swap: any) {
			return {
				message: `Approving ${swap.from}`,
			};
			},
		},
		APPROVE_CONFIRMED: {
			step: 1,
			label: 'Swapping {from}',
			filterStatus: 'PENDING',
		},
		WAITING_FOR_SEND_CONFIRMATIONS: {
			step: 1,
			label: 'Swapping {from}',
			filterStatus: 'PENDING',
			notification() {
			return {
				message: 'Swap initiated',
			};
			},
		},
		WAITING_FOR_RECEIVE: {
			step: 2,
			label: 'Swapping {from}',
			filterStatus: 'PENDING',
		},
		SUCCESS: {
			step: 3,
			label: 'Completed',
			filterStatus: 'COMPLETED',
			notification(swap: any) {
			return {
				message: `Swap completed, ${prettyBalance(swap.toAmount, swap.to)} ${swap.to} ready to use`,
			};
			},
		},
		REFUNDED: {
			step: 3,
			label: 'Refunded',
			filterStatus: 'REFUNDED',
			notification() {
			return {
				message: 'Swap refunded',
			};
			},
		},
		};
	}

	protected _txTypes() {
		return TeleSwapTxTypes;
	}

	protected _fromTxType(): string | null {
		return this._txTypes().SWAP;
	}

	protected _toTxType(): string | null {
		return null;
	}

	protected _timelineDiagramSteps(): string[] {
		return ['REQUEST', 'WAITING', 'RECEIVE'];
	}

	protected _totalSteps(): number {
		return 3;
	}

	private async _chooseLockerAddress(value: Number, network: Network) {
		const isMainnet = network === Network.Mainnet? true: false;

		// TODO: move url to config
		// for now, we only support Polygon
		const targetNetworkConnectionInfo = {
			web3: {
				url: "wss://polygon-mumbai.g.alchemy.com/v2/5M02lhCj_-C62MzO5TcSj53mOy-X-QPK",
			},
		};

		const lockers = await getLockers({
			'amount': value, 
			'type': 'transfer', // for now, we only support Bitcoin -> EVM through liquality
			'targetNetworkConnectionInfo': targetNetworkConnectionInfo, 
			'testnet': isMainnet
		});

		if (!lockers.preferredLocker) {
			throw createInternalError(CUSTOM_ERRORS.NotFound.Default); // TODO: edit error
		}

		// return best locker bitcoin address
		return lockers.preferredLocker.bitcoinAddress;
	}

	private _getChainId(asset: Asset, network: Network) {
		const chainId = cryptoassets[asset].chain;
		// if (chainId !== ChainId.Ethereum) {
		//   throw createInternalError(CUSTOM_ERRORS.Unsupported.Chain);
		// }
		const chain = getChain(network, chainId);
		return Number(chain.network.chainId);
	}

	private async _getOpReturnData(
		quote: TeleSwapSwapHistoryItem, 
		requestType: TeleSwapTxTypes, 
		network: Network,
		recipientAddress: String // user's evm address on liquality
	) {
	
		// const api = new ethers.providers.AlchemyWebSocketProvider(
		// 	"wss://polygon-mumbai.g.alchemy.com/v2/5M02lhCj_-C62MzO5TcSj53mOy-X-QPK"
		// );
		const api = new ethers.providers.InfuraProvider(
			this._getChainId(quote.to, network), 
			buildConfig.infuraApiKey // we use api key provided in buildConfig
		);

		// TODO: move url to config
		const targetNetworkConnectionInfo = {
			web3: {
				url: "wss://polygon-mumbai.g.alchemy.com/v2/5M02lhCj_-C62MzO5TcSj53mOy-X-QPK",
			},
		};

		let isExchange;
		const isMainnet = network === Network.Mainnet? true: false;
		const chainId = 3; // TODO: write func for it + update the amount
		let appId;
		const speed = 0; // for now, we only support normal through liquality 
		let exchangeTokenAddress;
		let deadline;
		let outputAmount;
		const isFixedToken = false;

		// calculate teleporter percentage fee
		const percentageFee = (await calculateFee({
			'amount': quote.fromAmount,
			'type': 'transfer', // for now, we only support Bitcoin -> EVM through liquality 
			'teleporterFeeRatio': 2,
			'minimumFee': 0.00001,
			'targetNetworkConnectionInfo': targetNetworkConnectionInfo,
			'testnet': isMainnet
		})).teleporterPercentageFee;

		if(requestType == TeleSwapTxTypes.SWAP) {
			isExchange = true;
			appId = EXCHANGE_APP_ID; // we use the first registered dex in teleswap
			exchangeTokenAddress = this.getTokenAddress(quote.to);
			deadline = (await api.getBlock('lastest')).timestamp + SUGGESTED_DEADLINE;
			// for now, we assume that the input token is fixed 
			outputAmount = await this._getOutputAmount({
				'from': quote.from, 
				'to': quote.to, 
				'fromAmountInUnit': BN(quote.fromAmount).times(10000 - Number(percentageFee) - PROTOCOL_FEE).div(10000),
				'network': network
			});
		} else {
			isExchange = false;
			appId = TRANSFER_APP_ID;
			exchangeTokenAddress = ZERO_ADDRESS;
			deadline = 0;
			outputAmount = 0;
		}
		
		// return hex format of op_return data
		return TeleportDaoPayment.getTransferOpReturnData({
			chainId,
			appId,
			recipientAddress,
			percentageFee,
			speed,
			isExchange,
			exchangeTokenAddress,
			outputAmount,
			deadline,
			isFixedToken,
		});
	}

	private async _getOutputAmount({
		from,
		to,
		fromAmountInUnit, 
		network
	}: {
		from: Asset;
		to: Asset;
		fromAmountInUnit: BigNumber;
		network: Network
	}) {

		// const api = new ethers.providers.AlchemyWebSocketProvider(
		// "wss://polygon-mumbai.g.alchemy.com/v2/5M02lhCj_-C62MzO5TcSj53mOy-X-QPK"
		// );
		const api = new ethers.providers.InfuraProvider(
			this._getChainId(to, network), 
			buildConfig.infuraApiKey // we use api key provided in buildConfig
		);
		
		// check that the liquidity pool exists
		const exchangeFactory = new ethers.Contract(
			this.config.QuickSwapFactoryAddress, UniswapV2Factory.abi, api
		);
		const pair = await exchangeFactory.getPair(this.getTokenAddress(to), this.getTokenAddress(from));
		if (pair == '0x0000000000000000000000000000000000000000') {
			// pair not exists
			throw createInternalError(CUSTOM_ERRORS.NotFound.Default);
		}

		// get the output amount having input amount
		// assume that a liquidty pool between to and from exists
		// TODO: if there is no direct liquidity pool between tokens
		const exchangeRouter = new ethers.Contract(
			this.config.QuickSwapRouterAddress, 
			UniswapV2Factory.abi, api
		);
		const outputAmount = exchangeRouter.getAmountsOut(
			fromAmountInUnit, 
			[this.getTokenAddress(to), this.getTokenAddress(from)]
		);

		// reduce slippage from output amount
		return outputAmount[outputAmount.length - 1]*(100 - SLIPPAGE);
	}

}

export { TeleSwapSwapProvider };