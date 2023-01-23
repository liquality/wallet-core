import { BitcoinBaseWalletProvider, BitcoinEsploraApiProvider } from '@chainify/bitcoin';
import { Client } from '@chainify/client';
import { ChainId, currencyToUnit, getChain, unitToCurrency } from '@liquality/cryptoassets'; 
import { isTransactionNotFoundError } from '../../utils/isTransactionNotFoundError';
// import ERC20 from '@uniswap/v2-core/build/ERC20.json';
import UniswapV2Factory from '@uniswap/v2-core/build/UniswapV2Factory.json';
import UniswapV2Router from '@uniswap/v2-periphery/build/UniswapV2Router02.json';
import BN from 'bignumber.js'; // { BigNumber }
import * as ethers from 'ethers';
import { ceil, mapValues } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import buildConfig from '../../build.config';
import { ActionContext } from '../../store'; // store
import { withInterval } from '../../store/actions/performNextAction/utils'; // withLock
import { Asset, Network, SwapHistoryItem, WalletId } from '../../store/types';
// import { isERC20 } from '../../utils/asset';
import { prettyBalance } from '../../utils/coinFormatter'; // fiatToCrypto
import cryptoassets from '../../utils/cryptoassets';
// import { getTxFee } from '../../utils/fees';
import { SwapProvider } from '../SwapProvider';
import { calculateFee, getLockers } from '@sinatdt/scripts';
import { teleswap } from '@sinatdt/configs';
import { TeleportDaoPayment } from '@sinatdt/bitcoin';

import {
	BaseSwapProviderConfig,
	EstimateFeeRequest,
	NextSwapActionRequest,
	QuoteRequest,
	SwapRequest,
	SwapStatus,
} from '../types'; // SwapQuote
import { CUSTOM_ERRORS, createInternalError } from '@liquality/error-parser';

const SUPPORTED_CHAINS = [[ChainId.Bitcoin, ChainId.Polygon, 'testnet']]; // [from, to, network]
const TRANSFER_APP_ID = 0;
const EXCHANGE_APP_ID = 1;
const SUGGESTED_DEADLINE = 100000000; // TODO: EDIT IT
const RELAY_FINALIZATION_PARAMETER = 1;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const PROTOCOL_FEE = 20; // locker fee (%0.15) + protocol fee (%0.05)
const SLIPPAGE = 10; // TODO: EDIT IT
const DUMMY_BYTES = '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

export interface TeleSwapSwapProviderConfig extends BaseSwapProviderConfig {
	QuickSwapRouterAddress: string;
	QuickSwapFactoryAddress: string;
	targetNetworkConnectionInfo: any;

}

export enum TeleSwapTxTypes {
	WRAP = 'WRAP',
	SWAP = 'SWAP',
}

export interface TeleSwapSwapHistoryItem extends SwapHistoryItem {
  swapTxHash: string;
  numberOfConfirmations: number;
}

class TeleSwapSwapProvider extends SwapProvider {
	
	config: TeleSwapSwapProviderConfig;

	constructor(config: TeleSwapSwapProviderConfig) {
		super(config);
	}

	async getSupportedPairs() { // seems not necessary since others didn't implement it
		return [];
	}

	isSwapSupported(from: Asset, to: Asset, network: Network) {
		const fromChainId = cryptoassets[from].chain;
		const toChainId = cryptoassets[to].chain;
		const _SUPPORTED_CHAINS = SUPPORTED_CHAINS.map((item) => JSON.stringify(item))
		return _SUPPORTED_CHAINS.includes(JSON.stringify([fromChainId, toChainId, network]));
	}

	async getQuote({ network, from, to, amount }: QuoteRequest) {

		// check that if the chains supported
		if(this.isSwapSupported(from, to, network) == false) {
			throw createInternalError(CUSTOM_ERRORS.Unsupported.Chain);
		}

		const api = new ethers.providers.InfuraProvider(
			this._getChainIdNumber(to, network), 
			buildConfig.infuraApiKey // we use api key provided in buildConfig
		);
		
		// reduce the fees
		const percentageFee = (await this._getTeleporterFee({ network, from, to, amount })).teleporterPercentageFee;
		let amountAfterFee = BN(amount).times(10000 - Number(percentageFee) - PROTOCOL_FEE).div(10000);
		const amountAfterFeeInUnit = currencyToUnit(cryptoassets[from], amountAfterFee);

		const fromAmountInUnit = currencyToUnit(cryptoassets[from], new BN(amount));
		
		if (to != 'TELEBTC') { // this request is swap
			// check that the liquidity pool exists
			const exchangeFactory = new ethers.Contract(
				this.config.QuickSwapFactoryAddress, UniswapV2Factory.abi, api
			);
			const pair = await exchangeFactory.getPair(this.getTokenAddress(from), this.getTokenAddress(to));
			let isDirectPair = true;
			if (pair == '0x0000000000000000000000000000000000000000') {
				isDirectPair = false
				// there is a pair between TeleBTC and WMATIC, so we check if there is pair between WMATIC and {to}
				let _pair = await exchangeFactory.getPair(this.getTokenAddress('WMATIC'), this.getTokenAddress(to));
				if (_pair == '0x0000000000000000000000000000000000000000') {
					// no path exists
					throw createInternalError(CUSTOM_ERRORS.NotFound.Default);
				}
			}
			
			// get the output amount having input amount
			const exchangeRouter = new ethers.Contract(
				this.config.QuickSwapRouterAddress, 
				UniswapV2Router.abi, api
			);
			
			let outputAmount;

			if (isDirectPair) {
				outputAmount = await exchangeRouter.getAmountsOut(
					ceil(amountAfterFeeInUnit.toNumber()), // round up the number
					[this.getTokenAddress(from), this.getTokenAddress(to)]
				);
			} else {
				outputAmount = await exchangeRouter.getAmountsOut(
					ceil(amountAfterFeeInUnit.toNumber()), // round up the number
					[this.getTokenAddress(from), this.getTokenAddress('WMATIC'), this.getTokenAddress(to)]
				);
			}

			const toAmountInUnit = new BN((outputAmount[outputAmount.length - 1]).toString());

			return {
				fromAmount: fromAmountInUnit.toFixed(),
				toAmount: toAmountInUnit.toFixed(),
			};
		} else {
			return { // this request is wrap
				fromAmount: fromAmountInUnit.toFixed(),
				toAmount: amountAfterFeeInUnit.toFixed(),
			};
		}
	}

	async sendBitcoinSwap({
		quote,
		network,
		walletId,
	}: {
		quote: TeleSwapSwapHistoryItem;
		network: Network;
		walletId: WalletId;
	}) {
		// send notif to ledger
		await this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');

		// find the best locker (is active and has capacity)
		// quote.from == 'BTC'
		const to = await this._chooseLockerAddress(quote.from, quote.fromAmount, network);

		// input amount
		const value = new BN(quote.fromAmount);

		// determine req type (wrap or swap)
		const requestType = (quote.to === "TeleBTC" || quote.to === "TElEBTC")? TeleSwapTxTypes.WRAP: TeleSwapTxTypes.SWAP;

		// get receipient address 
		const fromAddressRaw = await this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);

		// get OP_RETURN data
		const opReturnData = await this._getOpReturnData(quote, requestType, network, fromAddressRaw);
		
		// get client to sign tx
		const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
		const tx = await client.wallet.sendTransaction({
			to: to,
			value,
			data: opReturnData,
			fee: quote.fee, // TODO: is it bitcoin tx fee?
		});
		return tx;
	}

	async sendSwap({ network, walletId, swap }: NextSwapActionRequest<TeleSwapSwapHistoryItem>) {
		let bitcoinTx;

		if (swap.from === 'BTC') {
			bitcoinTx = await this.sendBitcoinSwap({
				quote: swap,
				network,
				walletId,
			});
		}

		if (!bitcoinTx) {
			throw createInternalError(CUSTOM_ERRORS.FailedAssert.SendTransaction);
		}	
		
		return {
			status: 'WAITING_FOR_SEND_CONFIRMATIONS',
			swapTxHash: bitcoinTx.hash,
			numberOfConfirmations: 0
		};
	}

	async newSwap({ network, walletId, quote }: SwapRequest<TeleSwapSwapHistoryItem>) {

		// check that if the chains supported
		if(!this.isSwapSupported(quote.from, quote.to, network)) {
			throw createInternalError(CUSTOM_ERRORS.Unsupported.Chain);
		}

		const updates = await this.sendSwap({ network, walletId, swap: quote });

		return {
			id: uuidv4(),
			fee: quote.fee,
			...updates,
		};
	}

  	// this func only estimates tx submission fee (not protocols fees)
	async estimateFees({ network, walletId, asset, txType, quote, feePrices, max }: EstimateFeeRequest) {
		
		if (txType === this._txTypes().SWAP && asset === 'BTC') {
		const client = this.getClient(network, walletId, asset, quote.fromAccountId) as Client<
			BitcoinEsploraApiProvider,
			BitcoinBaseWalletProvider
		>;
		const value = max ? undefined : new BN(quote.fromAmount);
		const txs = feePrices.map((fee) => ({ to: '', value, data: DUMMY_BYTES, fee }));
		const totalFees = await client.wallet.getTotalFees(txs, max);
		return mapValues(totalFees, (f) => unitToCurrency(cryptoassets[asset], f));
		}
		return null;
  	}

	async getMin(quote: QuoteRequest) {
		// return teleporterFee when input amount is 0
    	return new BN(
			(await this._getTeleporterFee(
				{network: quote.network, from: quote.from, to: quote.to, amount: new BN(0) }
			)).teleporterFeeInBTC
		);
	}

	// return address of asset
	getTokenAddress(asset: Asset) {
		switch(asset) {
			case 'TeleBTC':
			case 'TELEBTC':
			case 'BTC':
				return teleswap.tokenInfo.polygon.testnet.teleBTC
			case 'MATIC':
			case 'WMATIC':
				return teleswap.tokenInfo.polygon.testnet.link; 
			default:
				return teleswap.tokenInfo.polygon.testnet.link;
				// return cryptoassets[asset].contractAddress; TODO: UNCOMMENT IT
		}
	}

	async waitForSendConfirmations({ swap, network, walletId }: NextSwapActionRequest<TeleSwapSwapHistoryItem>) {
	
		const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
		try {
			const tx = await client.chain.getTransactionByHash(swap.swapTxHash);
			if (tx && tx.confirmations && tx.confirmations > 0) {
				return {
					endTime: Date.now(),
					status: 'WAITING_FOR_RECEIVE',
					numberOfConfirmations: tx.confirmations
				};
			}
		} catch (e) {
			if (isTransactionNotFoundError(e)) console.warn(e);
			else throw e;
		}
	}

	// wait for the tx to get finalized and then submitted on the cc router contract by teleporter
	async waitForReceive({ swap, network, walletId }: NextSwapActionRequest<TeleSwapSwapHistoryItem>) {
		
		const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
		try {
			// get number of bitcoin tx confirmations
			const bitcoinTxConfirmations = (await client.chain.getTransactionByHash(swap.swapTxHash)).confirmations;
			
			// if the tx get finalized, query cc router to see if the tx get submitted
			if (bitcoinTxConfirmations && bitcoinTxConfirmations >= RELAY_FINALIZATION_PARAMETER) {
				
				// get web3 provider
				const api = new ethers.providers.InfuraProvider(
					this._getChainIdNumber(swap.to, network), 
					buildConfig.infuraApiKey // we use api key provided in buildConfig
				);
				
				// set cc router contract
				let ccRouterFactory;
				if (swap.to == 'TeleBTC' || swap.to == 'TELEBTC') {
					ccRouterFactory = new ethers.Contract(
						teleswap.contractsInfo.polygon.testnet.ccTransferAddress, 
						teleswap.ABI.CCTransferRouterABI, 
						api
					);
				} else {
					ccRouterFactory = new ethers.Contract(
						teleswap.contractsInfo.polygon.testnet.ccExchangeAddress, 
						teleswap.ABI.CCExchangeRouterABI, 
						api
					);
				}
				
				const result = await ccRouterFactory.isRequestUsed('0x' + swap.swapTxHash);

				if (result) {
					return {
						endTime: Date.now(),
						status: 'SUCCESS',
						numberOfConfirmations: bitcoinTxConfirmations
					};
				}

				// TODO: WHAT TO DO IF USER REQUEST GET UNTOUCHED
			} else {
				return {
					endTime: Date.now(),
					status: 'WAITING_FOR_RECEIVE',
					numberOfConfirmations: bitcoinTxConfirmations
				};
			}
	    } catch (e) {
			console.error(`TeleSwap waiting for receive failed ${swap.swapTxHash}`, e);
		}
	}

	async performNextSwapAction(
		_store: ActionContext,
		{ network, walletId, swap }: NextSwapActionRequest<TeleSwapSwapHistoryItem>
	) {
		switch (swap.status) {
      		case 'WAITING_FOR_SEND_CONFIRMATIONS':
        		return withInterval(async () => this.waitForSendConfirmations({ swap, network, walletId }));
      		case 'WAITING_FOR_RECEIVE':
        		return withInterval(async () => this.waitForReceive({ swap, network, walletId }));
        		// return withInterval(async () => this.waitForSendConfirmations({ swap, network, walletId }));
		}
	}

	protected _getStatuses(): Record<string, SwapStatus> {
		return {
			WAITING_FOR_SEND_CONFIRMATIONS: {
				step: 0,
				label: 'Swapping {from}',
				filterStatus: 'PENDING',
				notification() {
					return {
						message: 'Swap initiated',
					};
				},
			},
			WAITING_FOR_RECEIVE: {
				step: 1,
				label: 'Receiving {to}',
				filterStatus: 'PENDING',
				notification(swap: any) {
					return {
						message: `Waiting for confirmations:  ${swap.numberOfConfirmations} / 6`,
					};
				},
			},
			SUCCESS: {
				step: 2,
				label: 'Completed',
				filterStatus: 'COMPLETED',
				notification(swap: any) {
					return {
						message: `Swap completed, ${prettyBalance(swap.toAmount, swap.to)} ${swap.to} ready to use`,
					};
				},
			},
			FAILED: {
				step: 2,
				label: 'Swap Failed',
				filterStatus: 'REFUNDED',
				notification(swap: any) {
					let refundedTeleBTC = swap.fromAmount; // TODO show the correct amount (reduce the fee)
					return {
						message: `Swap failed, ${prettyBalance(refundedTeleBTC, 'TeleBTC')} ${'TeleBTC'} refunded`,
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

	private async _chooseLockerAddress(from: Asset, value: string, network: Network) {
		const isMainnet = network === Network.Mainnet? true: false;

		// for now, we only support Polygon
		let lockers = await getLockers(
			{
				'amount': unitToCurrency(cryptoassets[from], Number(value)), 
				'type': 'transfer', // for now, we only support Bitcoin -> EVM through liquality
				'targetNetworkConnectionInfo': this.config.targetNetworkConnectionInfo, 
				'testnet': !isMainnet
			},
		);
		
		if (!lockers.preferredLocker) {
			throw createInternalError(CUSTOM_ERRORS.NotFound.Default); // TODO: edit error
		} else {
			// return best locker bitcoin address
			return lockers.preferredLocker.bitcoinAddress;
		}
		
	}

	private _getChainIdNumber(asset: Asset, network: Network) {
		const chainId = cryptoassets[asset].chain;
		// if (chainId !== ChainId.Ethereum) {
		//   throw createInternalError(CUSTOM_ERRORS.Unsupported.Chain);
		// }
		const chain = getChain(network, chainId);
		return Number(chain.network.chainId);
	}

  	private async _getTeleporterFee(quote: QuoteRequest) {
		const isMainnet = quote.network === Network.Mainnet? true: false;
		const calculatedFee: any = await calculateFee({
			'amount': quote.amount, // assume that amount is in currency (not unit)
			'type': 'transfer', // for now, we only support Bitcoin -> EVM through liquality 
			'targetNetworkConnectionInfo': this.config.targetNetworkConnectionInfo,
			'testnet': !isMainnet
		});

		return {
			teleporterFeeInBTC: calculatedFee.teleporterFeeInBTC,
			teleporterPercentageFee: (new BN(calculatedFee.teleporterFeeInBTC)).times(100).div(quote.amount)
		}
	}

	private async _getOpReturnData(
		quote: TeleSwapSwapHistoryItem, 
		requestType: TeleSwapTxTypes, 
		network: Network,
		recipientAddress: String // user's evm address on liquality
	) {
	
		const api = new ethers.providers.InfuraProvider(
			this._getChainIdNumber(quote.to, network), 
			buildConfig.infuraApiKey // we use api key provided in buildConfig
		);

		let isExchange;
		const chainId = 3; // TODO: write func for it + update the amount
		let appId;
		const speed = 0; // for now, we only support normal through liquality 
		let exchangeTokenAddress;
		let deadline;
		let outputAmount;
		const isFixedToken = false;

		// calculate teleporter percentage fee
		const percentageFee = (await this._getTeleporterFee(
			{
				network: network, 
				from: quote.from, 
				to: quote.to, 
				amount: unitToCurrency(cryptoassets[quote.from], Number(quote.fromAmount))
			}
   		)).teleporterPercentageFee;

		if(requestType == TeleSwapTxTypes.SWAP) {
			isExchange = true;
			appId = EXCHANGE_APP_ID; // we use the first registered dex in teleswap
			exchangeTokenAddress = this.getTokenAddress(quote.to);
			deadline = (await api.getBlock('latest')).timestamp + SUGGESTED_DEADLINE;
			// for now, we assume that the input token is fixed 
			outputAmount = ceil(Number((await this.getQuote(
				{
					network: network, 
					from: quote.from, 
					to: quote.to, 
					amount: new BN(quote.fromAmount) 
				}
			)).toAmount)*(100 - SLIPPAGE));
		} else {
			isExchange = false;
			appId = TRANSFER_APP_ID;
			exchangeTokenAddress = ZERO_ADDRESS;
			deadline = 0;
			outputAmount = 0;
		}
		
		// return hex format of op_return data
		return TeleportDaoPayment.getTransferOpReturnData(
			{
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
			}
		);
	}
}

export { TeleSwapSwapProvider };