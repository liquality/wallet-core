import { BitcoinBaseWalletProvider, BitcoinEsploraApiProvider } from '@chainify/bitcoin';
import { Client } from '@chainify/client';
import { ChainId, currencyToUnit, getChain, unitToCurrency } from '@liquality/cryptoassets'; 
import { Transaction } from '@chainify/types';
import { isTransactionNotFoundError } from '../../utils/isTransactionNotFoundError';
import ERC20 from '@uniswap/v2-core/build/ERC20.json';
import UniswapV2Factory from '@uniswap/v2-core/build/UniswapV2Factory.json';
import UniswapV2Router from '@uniswap/v2-periphery/build/UniswapV2Router02.json';
import BN from 'bignumber.js';
import * as ethers from 'ethers';
import { ceil, mapValues } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import buildConfig from '../../build.config';
import { ActionContext } from '../../store'; // store
import { withInterval, withLock } from '../../store/actions/performNextAction/utils'; 
import { Asset, Network, SwapHistoryItem, WalletId } from '../../store/types';
// import { isERC20 } from '../../utils/asset';
import { prettyBalance } from '../../utils/coinFormatter';
import cryptoassets from '../../utils/cryptoassets';
import { SwapProvider } from '../SwapProvider';
import { calculateFee, getLockers, getUserPendingBurns } from '@sinatdt/scripts';
import { teleswap } from '@sinatdt/configs';
import { TeleportDaoPayment, BitcoinInterface} from '@sinatdt/bitcoin';

import {
	BaseSwapProviderConfig,
	EstimateFeeRequest,
	NextSwapActionRequest,
	QuoteRequest,
	SwapRequest,
	SwapStatus,
} from '../types'; // SwapQuote
import { CUSTOM_ERRORS, createInternalError } from '@liquality/error-parser';

const SUPPORTED_CHAINS = [
	[ChainId.Bitcoin, ChainId.Polygon, 'testnet'], 
	[ChainId.Polygon, ChainId.Bitcoin, 'testnet']
]; // [from, to, network]
const addressTypesNumber = { p2pk: 0, p2pkh: 1, p2sh: 2, p2wpkh: 3 };
const TRANSFER_APP_ID = 1;
const EXCHANGE_APP_ID = 20;
const SUGGESTED_DEADLINE = 100000000; // TODO: EDIT IT
const RELAY_FINALIZATION_PARAMETER = 6;
const ZERO_ADDRESS = '0x' + '0'.repeat(20*2); // 20 bytes zero
const SLIPPAGE = 10; // TODO: EDIT IT
const DUMMY_BYTES = '0x' + '0'.repeat(79*2); // 79 bytes zero

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
	swapTx: Transaction; // bitcoin tx or burn tx
	swapTxHash: string;
	approveTxHash: string;
	numberOfBitcoinConfirmations: number;
	userBitcoinAddress: string;
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
		let fees;
		let amountAfterFee;
		let amountAfterFeeInUnit;
		const fromAmountInUnit = currencyToUnit(cryptoassets[from], new BN(amount));

		// check that if the chains supported
		if(this.isSwapSupported(from, to, network) == false) {
			throw createInternalError(CUSTOM_ERRORS.Unsupported.Chain);
		}
		
		if (from == 'BTC') { // this request is btc -> evm 

			fees = await this._getFees({ network, from, to, amount });
			amountAfterFee = BN(amount).plus(fees.TransactionFeeInBTC).minus(fees.totalFeeInBTC);
			amountAfterFeeInUnit = currencyToUnit(cryptoassets[from], amountAfterFee);

			let toAmountInUnit;
			if (to != 'TELEBTC') {
				toAmountInUnit = new BN(
					(await this.getOutputAmount(String(ceil(amountAfterFeeInUnit.toNumber())), from, to , network))
						.toString()
				)
			} else {
				toAmountInUnit = amountAfterFeeInUnit;
			}

			return {
				fromAmount: fromAmountInUnit.toFixed(),
				toAmount: toAmountInUnit.toFixed(),
			};
		} else { // this request is evm -> btc
			if (from != 'TELEBTC') {
				// teleBTC amount (after exchanging)
				const teleBTCAmount = unitToCurrency(
					cryptoassets['TELEBTC'], 
					parseInt((await this.getOutputAmount((currencyToUnit(cryptoassets[from], amount)).toString(), from, 'TELEBTC' , network))._hex, 16)
				);
				
				// reduce fees for burning telebtc
				fees = await this._getFees({ network, from, to, amount: teleBTCAmount}); 
				console.log("fees", fees);
				
				// find received amount
				amountAfterFee = teleBTCAmount.minus(fees.totalFeeInBTC);
				amountAfterFeeInUnit = currencyToUnit(cryptoassets['BTC'], amountAfterFee);

				return {
					fromAmount: fromAmountInUnit.toFixed(),
					toAmount: amountAfterFeeInUnit.toFixed(),
				};
			} else {
				fees = await this._getFees({ network, from, to, amount });
				amountAfterFee = BN(amount).minus(fees.totalFeeInBTC);
				amountAfterFeeInUnit = currencyToUnit(cryptoassets[from], amountAfterFee);
				return { 
					fromAmount: fromAmountInUnit.toFixed(),
					toAmount: amountAfterFeeInUnit.toFixed(),
				};
			}	
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
		const to = (await this._chooseLockerAddress(quote.from, quote.fromAmount, network)).bitcoinAddress;

		// input amount
		const value = new BN(quote.fromAmount);

		// determine req type (wrap or swap)
		const requestType = (quote.to == "TeleBTC" || quote.to == "TELEBTC")? TeleSwapTxTypes.WRAP: TeleSwapTxTypes.SWAP;

		// get receipient address 
		const fromAddressRaw = await this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);

		// get OP_RETURN data
		const opReturnData = await this._getOpReturnData(quote, requestType, network, fromAddressRaw);
		
		// get client to sign tx
		const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
		let tx;
		try {
			tx = await client.wallet.sendTransaction({
				to: to,
				value,
				data: opReturnData,
				fee: quote.fee, // TODO: is it bitcoin tx fee?
			});
		} catch {
			// return {
			// 	status: 'FAILED',
			// };
			throw createInternalError(CUSTOM_ERRORS.FailedAssert.SendTransaction); 
		}
		
		return {
			status: 'WAITING_FOR_SEND_CONFIRMATIONS',
			swapTxHash: tx?.hash,
			swapTx: tx,
			numberOfBitcoinConfirmations: 0
		};
	}

	async sendBurn({
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
		const _lockerLockingScript = (await this._chooseLockerAddress(
			quote.from, quote.fromAmount, network
		)).lockerLockingScript;

		// input amount
		const value = new BN(quote.fromAmount);

		// get receipient address (bitcoin) 
		const fromAddressRaw = await this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);
		
		// get client to sign tx
		const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);

		// approve amount to cc burn router
		const api = new ethers.providers.InfuraProvider(
			this._getChainIdNumber(quote.from, network), 
			buildConfig.infuraApiKey // we use api key provided in buildConfig
		);

		// send request to cc burn router
		const ccBurnRouter = new ethers.Contract(
			teleswap.contractsInfo.polygon.testnet.ccBurnAddress, 
			teleswap.ABI.CCBurnRouterABI, 
			api
		);

		const inputAmountHex = '0x' + (value.toNumber()).toString(16);
		
		let bitcoinNetwork = {
			"name": "bitcoin_testnet",
			"connection": {
				"api": {
					"enabled": true,
					"provider": "BlockStream",
					"token": null
				}
			}
		};
		const userBitcoinInfo = (new BitcoinInterface(bitcoinNetwork.connection, bitcoinNetwork.name))
			.convertAddressToObject(fromAddressRaw);
			
		const _userScript = '0x' + userBitcoinInfo.addressObject.hash?.toString("hex");
		const _scriptType = addressTypesNumber[userBitcoinInfo.addressType];

		const _encodedData = ccBurnRouter.interface.encodeFunctionData(
			'ccBurn', 
			[inputAmountHex, _userScript, _scriptType, _lockerLockingScript]
		);
		
		let tx;
		try {
			tx = await client.wallet.sendTransaction({
				to: teleswap.contractsInfo.polygon.testnet.ccBurnAddress,
				value: new BN(0),
				data: _encodedData,
				// fee: quote.fee, // TODO: CHECK IT
			});
		} catch {
			throw createInternalError(CUSTOM_ERRORS.FailedAssert.SendTransaction); 
		}
		
		return {
			status: 'WAITING_FOR_BURN_CONFIRMATIONS',
			swapTxHash: tx?.hash,
			swapTx: tx,
			userBitcoinAddress: fromAddressRaw
		};
	}

	async approveForBurn({
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

		// input amount
		const value = new BN(quote.fromAmount);
		
		// get client to sign tx
		const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);

		// approve amount to cc burn router
		const api = new ethers.providers.InfuraProvider(
			this._getChainIdNumber(quote.from, network), 
			buildConfig.infuraApiKey // we use api key provided in buildConfig
		);
    	const erc20 = new ethers.Contract(teleswap.tokenInfo.polygon.testnet.teleBTC, ERC20.abi, api);
		const inputAmountHex = '0x' + (value.toNumber()).toString(16); 
		const encodedData = erc20.interface.encodeFunctionData(
			'approve', 
			[teleswap.contractsInfo.polygon.testnet.ccBurnAddress, inputAmountHex]
		);
		
		let approveTx;
		
		try {
			approveTx = await client.wallet.sendTransaction({
				to: teleswap.tokenInfo.polygon.testnet.teleBTC,
				value: new BN(0),
				data: encodedData,
				// fee: quote.fee, // TODO: CHECK IT
			});
		} catch {
			throw createInternalError(CUSTOM_ERRORS.FailedAssert.SendTransaction); 
		}

		return {
			status: 'WAITING_FOR_APPROVE_CONFIRMATIONS',
			approveTxHash: approveTx?.hash,
		};
	}

	async sendSwap({ network, walletId, swap }: NextSwapActionRequest<TeleSwapSwapHistoryItem>) {

		if (swap.from === 'BTC') {
			return await this.sendBitcoinSwap({
				quote: swap,
				network,
				walletId,
			});
		}

		if (swap.from === 'TELEBTC' && swap.to === 'BTC') {
			return await this.approveForBurn({
				quote: swap,
				network,
				walletId,
			});
		}
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
		const totalFees = await client.wallet.getTotalFees(txs, max); // TODO: TRY AND CATCH?
		return mapValues(totalFees, (f) => unitToCurrency(cryptoassets[asset], f));
		}
		return null;
  	}

	async getMin(quote: QuoteRequest) {
		// return teleporterFee when input amount is 0
    	return new BN(
			(await this._getFees(
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

	async waitForBitcoinConfirmations({ swap, network, walletId }: NextSwapActionRequest<TeleSwapSwapHistoryItem>) {
	
		const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
		try {
			const tx = await client.chain.getTransactionByHash(swap.swapTxHash);
			if (tx && tx.confirmations && tx.confirmations > 0) {
				return {
					endTime: Date.now(),
					status: 'WAITING_FOR_RECEIVE',
					numberOfBitcoinConfirmations: tx.confirmations
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
			if (bitcoinTxConfirmations && bitcoinTxConfirmations >= (RELAY_FINALIZATION_PARAMETER - 1)) {
				
				// get web3 provider
				const api = new ethers.providers.InfuraProvider(
					this._getChainIdNumber(swap.to, network), 
					buildConfig.infuraApiKey // we use api key provided in buildConfig
				);
				
				// set cc router contract
				let ccRouterFactory;
				if (swap.to == 'TELEBTC') {
					ccRouterFactory = new ethers.Contract(
						teleswap.contractsInfo.polygon.testnet.ccTransferAddress, 
						teleswap.ABI.CCTransferRouterABI, 
						api
					);
				} else {
					console.log("we are exchange")
					ccRouterFactory = new ethers.Contract(
						teleswap.contractsInfo.polygon.testnet.ccExchangeAddress, 
						teleswap.ABI.CCExchangeRouterABI, 
						api
					);
				}
				
				const result = await ccRouterFactory.isRequestUsed('0x' + this.changeEndianness(swap.swapTxHash));
				
				if (result) {
					return {
						endTime: Date.now(),
						status: 'SUCCESS',
						numberOfBitcoinConfirmations: bitcoinTxConfirmations
					};
				} else if (bitcoinTxConfirmations > RELAY_FINALIZATION_PARAMETER*2) {
					// if s.th goes wrong (no teleporter colllects the request)
					return {
						endTime: Date.now(),
						status: 'FAILED',
						numberOfBitcoinConfirmations: bitcoinTxConfirmations
					};
				}
			} else if (bitcoinTxConfirmations && bitcoinTxConfirmations > swap.numberOfBitcoinConfirmations) {
				return {
					endTime: Date.now(),
					status: 'WAITING_FOR_RECEIVE',
					numberOfBitcoinConfirmations: bitcoinTxConfirmations
				};
			}
	    } catch (e) {
			throw CUSTOM_ERRORS.Unknown;
		}
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

	async waitForBurnConfirmations({ swap, network, walletId }: NextSwapActionRequest<TeleSwapSwapHistoryItem>) {
		const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
	
		try {
			const tx = await client.chain.getTransactionByHash(swap.swapTxHash);
			
			console.log(tx.logs);
	
		  	if (tx && tx.confirmations && tx.confirmations > 0) {
				return {
			  		endTime: Date.now(),
			  		status: 'WAITING_FOR_BURN_BITCOIN_CONFIRMATIONS',
				};
		  	}
		} catch (e) {
			if (isTransactionNotFoundError(e)) console.warn(e);
		  	else throw e;
		}
	}

	async waitForBurnBitcoinConfirmations({ swap, network }: NextSwapActionRequest<TeleSwapSwapHistoryItem>) {
	
		try {
			const isMainnet = network === Network.Mainnet? true: false;

			let userBurnReqs = (await getUserPendingBurns({
				userBurnRequests: [
					{address: swap.userBitcoinAddress, amount: swap.toAmount},
					{address: swap.userBitcoinAddress, amount: String(Number(swap.toAmount) + 1)},
					{address: swap.userBitcoinAddress, amount: String(Number(swap.toAmount) + 2)}
				],
				// lockerAddresses
				targetNetworkConnectionInfo: this.config.targetNetworkConnectionInfo,
				testnet: !isMainnet,
			}));
			
			// console.log("userBurnReqs", userBurnReqs, swap.toAmount);
		  	
			// if (userBurnReqs.processedBurns.length > 0) { // TODO: FIX IT
			// 	return {
			//   		endTime: Date.now(),
			//   		status: 'SUCCESS',
			// 	};
			// }
			if (userBurnReqs.processedBurns) { // TODO: FIX IT
				return {
			  		endTime: Date.now(),
			  		status: 'SUCCESS',
				};
			}

		} catch (e) {
			if (isTransactionNotFoundError(e)) console.warn(e);
		  	else throw e;
		}
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
          			this.sendBurn({ quote: swap, network, walletId })
				);
			case 'WAITING_FOR_BURN_CONFIRMATIONS':
				return withInterval(async () => this.waitForBurnConfirmations({ swap, network, walletId }));
			case 'WAITING_FOR_BURN_BITCOIN_CONFIRMATIONS':
				return withInterval(async () => this.waitForBurnBitcoinConfirmations({ swap, network, walletId }));
      		case 'WAITING_FOR_SEND_CONFIRMATIONS':
        		return withInterval(async () => this.waitForBitcoinConfirmations({ swap, network, walletId }));
      		case 'WAITING_FOR_RECEIVE':
        		return withInterval(async () => this.waitForReceive({ swap, network, walletId }));
		}
	}

	protected _getStatuses(): Record<string, SwapStatus> {
		return {
			WAITING_FOR_APPROVE_CONFIRMATIONS: {
				step: 0,
				label: 'Approve {from}',
				filterStatus: 'PENDING',
				notification() {
					return {
						message: 'Swap initiated',
					};
				},
			},
			APPROVE_CONFIRMED: {
				step: 0,
				label: 'Swapping {from}',
				filterStatus: 'PENDING',
				notification() {
					return {
						message: 'Approve confirmed',
					};
				},
			},
			WAITING_FOR_BURN_CONFIRMATIONS: {
				step: 1,
				label: 'Swapping {from}',
				filterStatus: 'PENDING',
			},
			WAITING_FOR_BURN_BITCOIN_CONFIRMATIONS: {
				step: 1,
				label: 'Swapping {from}',
				filterStatus: 'PENDING',
				notification() {
					return {
						message: 'Waiting for receiving BTC',
					};
				},
			},
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
						message: `Waiting for confirmations:  ${swap.numberOfBitcoinConfirmations} / 6`,
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
				filterStatus: 'FAILED',
				notification(swap: any) {
					return {
						message: `Swap failed, please send ${swap?.swapTxHash} to the TeleportDAO discord`,
					};
				},
			},
			PARTIAL_FAILED: {
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
		let type = (from == 'BTC') ? 'transfer' : 'burn';

		// for now, we only support Polygon
		let lockers = await getLockers(
			{
				'amount': unitToCurrency(cryptoassets['BTC'], Number(value)), // TODO: REPLACE WITH cryptoassets[from]
				'type': type, // for now, we only support Bitcoin -> EVM through liquality
				'targetNetworkConnectionInfo': this.config.targetNetworkConnectionInfo, 
				'testnet': !isMainnet
			},
		);
		
		if (!lockers.preferredLocker) {
			throw createInternalError(CUSTOM_ERRORS.NotFound.Default); // TODO: edit error
		} else {
			// return best locker bitcoin address
			return {
				bitcoinAddress: lockers.preferredLocker.bitcoinAddress,
				lockerLockingScript: lockers.preferredLocker.lockerInfo.lockerLockingScript
			}
		}
		
	}

	private _getChainIdNumber(asset: Asset, network: Network) {
		const chainId = cryptoassets[asset].chain;
		const chain = getChain(network, chainId);
		return Number(chain.network.chainId);
	}

  	private async _getFees(quote: QuoteRequest) {
		const isMainnet = quote.network === Network.Mainnet? true: false;
		let calculatedFee: any;

		if (quote.from == 'BTC') {
			calculatedFee = await calculateFee({
				'amount': quote.amount, // assume that amount is in currency (not unit)
				'type': 'transfer', // btc -> evm
				'targetNetworkConnectionInfo': this.config.targetNetworkConnectionInfo,
				'testnet': !isMainnet
			});
		} else {
			calculatedFee = await calculateFee({
				'amount': quote.amount, // assume that amount is in currency (not unit)
				'type': 'burn', // evm -> btc
				'targetNetworkConnectionInfo': this.config.targetNetworkConnectionInfo,
				'testnet': !isMainnet
			});
		}

		return {
			teleporterFeeInBTC: calculatedFee.teleporterFeeInBTC || 0,
			teleporterPercentageFee: calculatedFee.teleporterPercentageFee || 0,
			TransactionFeeInBTC: calculatedFee.TransactionFeeInBTC || 0,
			totalFeeInBTC: calculatedFee.totalFeeInBTC,
		}
	}

	private async getOutputAmount(
		amount: String, 
		from: Asset,
		to: Asset, 
		network: Network
	) {

		const api = new ethers.providers.InfuraProvider(
			this._getChainIdNumber(to, network), 
			buildConfig.infuraApiKey // we use api key provided in buildConfig
		);

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
				amount,
				[this.getTokenAddress(from), this.getTokenAddress(to)]
			);
		} else {
			outputAmount = await exchangeRouter.getAmountsOut(
				amount,
				[this.getTokenAddress(from), this.getTokenAddress('WMATIC'), this.getTokenAddress(to)]
			);
		}

		return outputAmount[outputAmount.length - 1];
	}

	private changeEndianness = (input: String) => {
        const result = [];
        let len = input.length - 2;
        while (len >= 0) {
          result.push(input.substr(len, 2));
          len -= 2;
        }
        return result.join('');
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
		const chainId = 137; // TODO: write func for it + update the amount
		let appId;
		const speed = 0; // for now, we only support normal through liquality 
		let exchangeTokenAddress;
		let deadline;
		let outputAmount;
		const isFixedToken = false;

		// calculate teleporter percentage fee
		const percentageFee = (await this._getFees(
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
			appId = TRANSFER_APP_ID
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