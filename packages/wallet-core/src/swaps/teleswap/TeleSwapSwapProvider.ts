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
import { ActionContext } from '../../store';
import { withInterval, withLock } from '../../store/actions/performNextAction/utils'; 
import { Asset, Network, SwapHistoryItem, WalletId } from '../../store/types';
// import { isERC20 } from '../../utils/asset';
import { prettyBalance } from '../../utils/coinFormatter';
import cryptoassets from '../../utils/cryptoassets';
import { SwapProvider } from '../SwapProvider';
import { calculateFee, getLockers, getUserPendingBurns } from '@teleportdao/scripts';
import { teleswap } from '@teleportdao/configs';
import { TeleportDaoPayment, BitcoinInterface} from '@teleportdao/bitcoin';

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
	[ChainId.Polygon, ChainId.Bitcoin, 'testnet'],
	[ChainId.Bitcoin, ChainId.Polygon, 'mainnet'],
	[ChainId.Polygon, ChainId.Bitcoin, 'mainnet']
]; // [from, to, network]

const addressTypesNumber = { p2pk: 0, p2pkh: 1, p2sh: 2, p2wpkh: 3 };
const TRANSFER_APP_ID = 1;
const EXCHANGE_APP_ID = 20; // QuickSwap app id
const SUGGESTED_DEADLINE = 7200; // 12 Bitcoin blocks
const RELAY_FINALIZATION_PARAMETER = 5;
const ZERO_ADDRESS = '0x' + '0'.repeat(20*2); // 20 bytes zero
const SLIPPAGE = 5;
const DUMMY_BYTES = '0x' + '0'.repeat(79*2); // 79 bytes zero

export interface TeleSwapSwapProviderConfig extends BaseSwapProviderConfig {
	QuickSwapRouterAddress: string;
	QuickSwapFactoryAddress: string;
}

export enum TeleSwapTxTypes {
	WRAP = 'WRAP',
	SWAP = 'SWAP',
}

export interface TeleSwapSwapHistoryItem extends SwapHistoryItem {
	swapTx: Transaction; // bitcoin tx or burn tx
	swapTxHash: string;
	approveTxHash: string;
	exchangeApproveTxHash: string;
	exchangeTxHash: string;
	exchangedTeleBTCAmount: BN
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
		const fromChain = cryptoassets[from].chain;
		const toChain = cryptoassets[to].chain;
		const _SUPPORTED_CHAINS = SUPPORTED_CHAINS.map((item) => JSON.stringify(item))
		return _SUPPORTED_CHAINS.includes(JSON.stringify([fromChain, toChain, network]));
	}

	async getQuote({ network, from, to, amount }: QuoteRequest) {
		let fees;
		let amountAfterFee;
		let amountAfterFeeInUnit;
		// amount is in currency
		const fromAmountInUnit = currencyToUnit(cryptoassets[from], new BN(amount));

		// check that the chains supported
		if(this.isSwapSupported(from, to, network) == false) {
			throw createInternalError(CUSTOM_ERRORS.Unsupported.Chain);
		}
		
		if (from == 'BTC') { // this request is bitcoin -> evm (wrap or exchange)

			fees = await this.getFees({ network, from, to, amount });
			amountAfterFee = BN(amount).minus(fees.totalFeeInBTC);
			amountAfterFeeInUnit = currencyToUnit(cryptoassets[from], amountAfterFee);

			let toAmountInUnit;
			if (to != 'TELEBTC') { // exchange
				toAmountInUnit = new BN(
					(await this.getOutputAmount(String(ceil(amountAfterFeeInUnit.toNumber())), from, to , network))
						.toString()
				)
			} else { // wrap
				toAmountInUnit = amountAfterFeeInUnit;
			}

			return {
				fromAmount: fromAmountInUnit.toFixed(), // input amount
				toAmount: toAmountInUnit.toFixed(), // output amount
			};
		} else { // this request is evm -> btc
			if (from != 'TELEBTC') { // exchange
				// teleBTC amount (after exchanging)
				const teleBTCAmount = unitToCurrency(
					cryptoassets['TELEBTC'], 
					parseInt((await this.getOutputAmount((currencyToUnit(cryptoassets[from], amount)).toString(), from, 'TELEBTC' , network))._hex, 16)
				);
				
				// reduce fees for burning telebtc
				fees = await this.getFees({ network, from, to, amount: teleBTCAmount}); 
				console.log("fees", fees);
				
				// find received amount
				amountAfterFee = teleBTCAmount.minus(fees.totalFeeInBTC);
				amountAfterFeeInUnit = currencyToUnit(cryptoassets['BTC'], amountAfterFee);

				return {
					fromAmount: fromAmountInUnit.toFixed(),
					toAmount: amountAfterFeeInUnit.toFixed(),
				};
			} else { // unwrap
				fees = await this.getFees({ network, from, to, amount });
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
		// polygon not supported
		// // send notif to ledger
		// await this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');

		// find the best locker (is active and has enough capacity)
		const to = (await this._chooseLockerAddress(quote.from, quote.to, quote.fromAmount, network)).bitcoinAddress;

		// input amount
		const value = new BN(quote.fromAmount);

		// determine req type (wrap or swap)
		const requestType = (quote.to == "TELEBTC") ? TeleSwapTxTypes.WRAP : TeleSwapTxTypes.SWAP;

		// get receipient address 
		const fromAddressRaw = await this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);

		// get OP_RETURN data
		const opReturnData = await this._getOpReturnData(quote, requestType, network, fromAddressRaw);
		
		// get client to sign tx
		const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
		let tx;
		try {
			console.log("quote.fee", quote);
			tx = await client.wallet.sendTransaction({
				to: to,
				value,
				data: opReturnData
			});
		} catch {
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

		// input amount
		let value;
		if (quote.exchangedTeleBTCAmount) { // if it not undefined
			// non-telebtc -> btc
			value = quote.exchangedTeleBTCAmount;
		} else {
			// telebtc -> btc
			value = new BN(quote.fromAmount)
		}

		// // send notif to ledger
		// await this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');
		
		// find the best locker (is active and has capacity)
		const _lockerLockingScript = (
			await this._chooseLockerAddress(
				'TELEBTC', quote.to, value.toString(), network
			)
		).lockerLockingScript;

		// get receipient bitcoin address
		const fromAddressRaw = await this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);
		
		// get client to sign tx
		const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);

		const api = new ethers.providers.InfuraProvider(
			this.getChainIdNumber(quote.from, network), 
			buildConfig.infuraApiKey
		);

		const ccBurnRouterAddress = (quote.network == Network.Mainnet) ? 
			teleswap.contractsInfo.polygon.mainnet.ccBurnAddress :
				teleswap.contractsInfo.polygon.testnet.ccBurnAddress;

		// send request to cc burn router
		const ccBurnRouter = new ethers.Contract(
			ccBurnRouterAddress, 
			teleswap.ABI.CCBurnRouterABI, 
			api
		);

		const inputAmountHex = '0x' + (value.toNumber()).toString(16);
		
		const networkName = (quote.network == Network.Mainnet) ? "bitcoin" : "bitcoin_testnet";
		let bitcoinNetwork = {
			"name": networkName,
			"connection": {
				"api": {
					"enabled": true,
					"provider": "BlockStream",
					"token": null
				}
			}
		};

		const bitcoinAddressObject = (new BitcoinInterface(bitcoinNetwork.connection, bitcoinNetwork.name))
			.convertAddressToObject(fromAddressRaw);

		const _userScript = '0x' + bitcoinAddressObject.addressObject.hash?.toString("hex");
		const _scriptType = addressTypesNumber[bitcoinAddressObject.addressType];

		const _encodedData = ccBurnRouter.interface.encodeFunctionData(
			'ccBurn', 
			[inputAmountHex, _userScript, _scriptType, _lockerLockingScript]
		);
		
		let tx;
		try {
			tx = await client.wallet.sendTransaction({
				to: ccBurnRouterAddress,
				value: new BN(0),
				data: _encodedData
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

	async sendExchange({
		quote,
		network,
		walletId,
	}: {
		quote: TeleSwapSwapHistoryItem;
		network: Network;
		walletId: WalletId;
	}) {
		// // send notif to ledger
		// await this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');

		// input amount
		const value = new BN(quote.fromAmount);

		// get receipient address (bitcoin) 
		const fromAddressRaw = await this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
		
		// get client to sign tx
		const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);

		const api = new ethers.providers.InfuraProvider(
			this.getChainIdNumber(quote.from, network), 
			buildConfig.infuraApiKey
		);

		// exchange input token for TeleBTC
		const exchangeRouter = new ethers.Contract(
			this.config.QuickSwapRouterAddress, 
			UniswapV2Router.abi, 
			api
		);

		// exchange from token -> teleBTC
		const path = [
			this.getTokenAddress(quote.from, network), 
			this.getTokenAddress('TELEBTC', network)
		] // TODO: IF PATH NOT EXIST

		// teleBTC amount (after exchanging)
		const exchangedTeleBTC = unitToCurrency(
			cryptoassets['TELEBTC'], 
			parseInt(
				(await this.getOutputAmount(
					value.toString(),
					quote.from,
					'TELEBTC',
					network
				))._hex, 
				16
			)
		);
		

		const inputAmountHex = '0x' + (value.toNumber()).toString(16);
		const outputAmountHex = '0x' + (0).toString(16);

		console.log("path", path, "inputAmountHex", inputAmountHex, "exchangedTeleBTC", exchangedTeleBTC.toString());

		const deadline = (await api.getBlock('latest')).timestamp + 1000000; // TODO: CHANGE IT

		const _encodedData = exchangeRouter.interface.encodeFunctionData(
			'swapExactTokensForTokens', 
			[inputAmountHex, outputAmountHex, path, fromAddressRaw, deadline]
		);

		let tx;
		try {
			tx = await client.wallet.sendTransaction({
				to: this.config.QuickSwapRouterAddress,
				value: new BN(0),
				data: _encodedData
			});
		} catch {
			throw createInternalError(CUSTOM_ERRORS.FailedAssert.SendTransaction); 
		}
		
		return {
			status: 'WAITING_FOR_EXCHANGE_CONFIRMATIONS',
			exchangeTxHash: tx?.hash,
			exchangedTeleBTCAmount: exchangedTeleBTC
		};
	}

	async approveForExchange({
		quote,
		network,
		walletId,
	}: {
		quote: TeleSwapSwapHistoryItem;
		network: Network;
		walletId: WalletId;
	}) {
		// // send notif to ledger
		// await this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');

		// input amount
		const value = new BN(quote.fromAmount);
		
		// get client to sign tx
		const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);

		// approve amount to exchange router
		const api = new ethers.providers.InfuraProvider(
			this.getChainIdNumber(quote.from, network), 
			buildConfig.infuraApiKey
		);
    	const erc20 = new ethers.Contract(this.getTokenAddress(quote.from, network)!, ERC20.abi, api);
		const inputAmountHex = '0x' + (value.toNumber()).toString(16); 
		const encodedData = erc20.interface.encodeFunctionData(
			'approve', 
			[this.config.QuickSwapRouterAddress, inputAmountHex]
		);
		
		let exchangeApproveTx;
		
		try {
			exchangeApproveTx = await client.wallet.sendTransaction({
				to: this.getTokenAddress(quote.from, network),
				value: new BN(0),
				data: encodedData
			});
		} catch {
			throw createInternalError(CUSTOM_ERRORS.FailedAssert.SendTransaction); 
		}

		return {
			status: 'WAITING_FOR_EXCHANGE_APPROVE_CONFIRMATIONS',
			exchangeApproveTxHash: exchangeApproveTx?.hash,
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

		// input amount
		let value;
		if (quote.exchangedTeleBTCAmount) { // if it not undefined
			// non-telebtc -> btc
			value = quote.exchangedTeleBTCAmount;
		} else {
			// telebtc -> btc
			value = new BN(quote.fromAmount)
		}

		// // send notif to ledger
		// await this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');
				
		// get evm client to sign tx
		const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);

		// approve amount to cc burn router
		const api = new ethers.providers.InfuraProvider(
			this.getChainIdNumber(quote.from, network), 
			buildConfig.infuraApiKey
		);
		const teleBTCAddress = cryptoassets['TELEBTC'].contractAddress;

    	const erc20 = new ethers.Contract(teleBTCAddress!, ERC20.abi, api);
		const inputAmountHex = '0x' + (value.toNumber()).toString(16); 

		const ccBurnRouterAddress = (quote.network == Network.Mainnet) ? 
			teleswap.contractsInfo.polygon.mainnet.ccBurnAddress :
				teleswap.contractsInfo.polygon.testnet.ccBurnAddress;

		const encodedData = erc20.interface.encodeFunctionData(
			'approve', 
			[ccBurnRouterAddress, inputAmountHex]
		);
		
		let approveTx;
		
		try {
			approveTx = await client.wallet.sendTransaction({
				to: teleBTCAddress,
				value: new BN(0),
				data: encodedData
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

		// wrap or exchange
		if (swap.from == 'BTC') { // wrap or swap
			return await this.sendBitcoinSwap({
				quote: swap,
				network,
				walletId,
			});
		}

		if (swap.from != 'TELEBTC' && swap.to == 'BTC') { // swap and unwrap
			return await this.approveForExchange({
				quote: swap,
				network,
				walletId,
			});
		}

		if (swap.from == 'TELEBTC' && swap.to == 'BTC') { // unwrap
			return await this.approveForBurn({
				quote: swap,
				network,
				walletId,
			});
		}
	}

	// main function
	async newSwap({ network, walletId, quote }: SwapRequest<TeleSwapSwapHistoryItem>) {

		// check that the chains supported
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
			(await this.getFees(
				{network: quote.network, from: quote.from, to: quote.to, amount: new BN(0) }
			)).teleporterFeeInBTC
		);
	}

	// return address of asset
	getTokenAddress(asset: Asset, network: Network) {
		switch(asset) {
			case 'teleBTC':
			case 'TELEBTC':
			case 'BTC':
				return (network == Network.Mainnet) ? cryptoassets['PTELEBTC'].contractAddress : teleswap.tokenInfo.polygon.testnet.teleBTCAddress;
			case 'MATIC':
			case 'WMATIC':
				return (network == Network.Mainnet) ? cryptoassets['PWMATIC'].contractAddress : teleswap.tokenInfo.polygon.testnet.WrappedMATICAddress;
			default:
				return (network == Network.Mainnet) ? cryptoassets[asset].contractAddress : teleswap.tokenInfo.polygon.testnet.chainlinkAddress;
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
					this.getChainIdNumber(swap.to, network), 
					buildConfig.infuraApiKey
				);
				
				// set cc router contract
				let ccRouterFactory;
				let ccRouterFactoryAddress;

				if (swap.to == 'TELEBTC') { // wrap
					ccRouterFactoryAddress = (swap.network == Network.Mainnet) ? 
						teleswap.contractsInfo.polygon.mainnet.ccTransferAddress : 
							teleswap.contractsInfo.polygon.testnet.ccTransferAddress 	

					ccRouterFactory = new ethers.Contract(
						ccRouterFactoryAddress, 
						teleswap.ABI.CCTransferRouterABI, 
						api
					);
				} else { // swap
					ccRouterFactoryAddress = (swap.network == Network.Mainnet) ? 
						teleswap.contractsInfo.polygon.mainnet.ccExchangeAddress : 
							teleswap.contractsInfo.polygon.testnet.ccExchangeAddress 

					ccRouterFactory = new ethers.Contract(
						ccRouterFactoryAddress, 
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
				} else if (bitcoinTxConfirmations > (RELAY_FINALIZATION_PARAMETER + 1) * 2) {
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

	async waitForExchangeApproveConfirmations({ swap, network, walletId }: NextSwapActionRequest<TeleSwapSwapHistoryItem>) {
		const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
	
		try {
			const tx = await client.chain.getTransactionByHash(swap.exchangeApproveTxHash);
	
		  	if (tx && tx.confirmations && tx.confirmations > 0) {
				return {
			  		endTime: Date.now(),
			  		status: 'EXCHANGE_APPROVE_CONFIRMED',
				};
		  	}
		} catch (e) {
			if (isTransactionNotFoundError(e)) console.warn(e);
		  	else throw e;
		}
	}

	async waitForExchangeConfirmations({ swap, network, walletId }: NextSwapActionRequest<TeleSwapSwapHistoryItem>) {
		const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
	
		try {
			const tx = await client.chain.getTransactionByHash(swap.exchangeTxHash);
	
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

	async waitForBurnConfirmations({ swap, network, walletId }: NextSwapActionRequest<TeleSwapSwapHistoryItem>) {
		const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
	
		try {
			const tx = await client.chain.getTransactionByHash(swap.swapTxHash);
	
		  	if (tx && tx.confirmations && tx.confirmations > 0) {

				// find burnt amount from event
				const api = new ethers.providers.InfuraWebSocketProvider(
					this.getChainIdNumber(swap.from, network), 
					buildConfig.infuraApiKey
				);

				const ccBurnRouterAddress = (network == Network.Mainnet) ? 
					teleswap.contractsInfo.polygon.mainnet.ccBurnAddress :
						teleswap.contractsInfo.polygon.testnet.ccBurnAddress;

				const ccBurnRouter = new ethers.Contract(
					ccBurnRouterAddress, 
					teleswap.ABI.CCBurnRouterABI, 
					api
				);

				const fromAddressRaw = await this.getSwapAddress(network, walletId, swap.from, swap.fromAccountId);
				const filter = ccBurnRouter.filters.CCBurn(
					fromAddressRaw
				);

				const receipt = await api.getTransactionReceipt(swap.swapTxHash);
				const logs = await ccBurnRouter.queryFilter(filter, receipt.blockNumber, receipt.blockNumber);
								
				const event = ccBurnRouter.interface.parseLog(logs[0]);
				const burntAmount = (event.args.burntAmount).toNumber();

				return {
			  		endTime: Date.now(),
			  		status: 'WAITING_FOR_BURN_BITCOIN_CONFIRMATIONS',
					toAmount: String(burntAmount) // replace the exact burnt amount
				};
		  	}
		} catch (e) {
			if (isTransactionNotFoundError(e)) console.warn(e);
		  	else throw e;
		}
	}

	async waitForBurnBitcoinConfirmations({ swap, network }: NextSwapActionRequest<TeleSwapSwapHistoryItem>) {
	
		try {
			const isTestnet = network === Network.Testnet ? true : false;
			
			let userBurnReqs = (await getUserPendingBurns({
				userBurnRequests: [
					{
						address: swap.userBitcoinAddress, 
						amount: swap.toAmount // TODO: (unitToCurrency(cryptoassets['BTC'], Number(swap.toAmount))).toNumber()
					}
				],
				targetNetworkConnectionInfo: this.getTargetNetworkConnectionInfo(swap.from, swap.network),
				testnet: isTestnet,
			}));
			
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
			case 'WAITING_FOR_EXCHANGE_APPROVE_CONFIRMATIONS':
        		return withInterval(async () => this.waitForExchangeApproveConfirmations({ swap, network, walletId }));
			case 'EXCHANGE_APPROVE_CONFIRMED':
				return withLock(store, { item: swap, network, walletId, asset: swap.from }, async () =>
          			this.sendExchange({ quote: swap, network, walletId })
				);
			case 'WAITING_FOR_EXCHANGE_CONFIRMATIONS':
				return withInterval(async () => this.waitForExchangeConfirmations({ swap, network, walletId }));
			case 'EXCHANGE_CONFIRMED':
				return withLock(store, { item: swap, network, walletId, asset: swap.from }, async () =>
          			this.approveForBurn({ quote: swap, network, walletId })
				);
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
			WAITING_FOR_EXCHANGE_APPROVE_CONFIRMATIONS: {
				step: 0,
				label: 'Approve {from}',
				filterStatus: 'PENDING',
				notification() {
					return {
						message: 'Swap initiated',
					};
				},
			},
			EXCHANGE_APPROVE_CONFIRMED: {
				step: 0,
				label: 'Swapping {from}',
				filterStatus: 'PENDING',
				notification() {
					return {
						message: 'Exchange approve confirmed',
					};
				},
			},
			WAITING_FOR_EXCHANGE_CONFIRMATIONS: {
				step: 1,
				label: 'Swapping {from}',
				filterStatus: 'PENDING',
			},
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
						message: 'Burn approve confirmed',
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
						message: `Waiting for confirmations:  ${swap.numberOfBitcoinConfirmations} / ${RELAY_FINALIZATION_PARAMETER}`,
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
						message: `Swap failed, ${prettyBalance(refundedTeleBTC, 'teleBTC')} ${'teleBTC'} refunded`,
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

	private async _chooseLockerAddress(from: Asset, to: Asset, value: string, network: Network) {
		// determine testnet or mainnet
		const isTestnet = (network === Network.Testnet) ? true : false;

		// determine req type (Bitcoin to EVM to EVM to Bitcoin)
		const type = (from == 'BTC') ? 'transfer' : 'burn';
		const targetNetworkConnectionInfo = (from == 'BTC') ? 
			this.getTargetNetworkConnectionInfo(to, network) :
				this.getTargetNetworkConnectionInfo(from, network);

		let lockers = await getLockers(
			{
				'amount': unitToCurrency(cryptoassets['BTC'], Number(value)), // BTC and TELEBTC has same decimal
				'type': type,
				'targetNetworkConnectionInfo': targetNetworkConnectionInfo,
				'testnet': isTestnet
			},
		);
		
		if (!lockers.preferredLocker) {
			throw createInternalError("Lockers capacity is low (decrease input amount)");
		} else {
			// return best locker's bitcoin address
			return {
				bitcoinAddress: lockers.preferredLocker.bitcoinAddress,
				lockerLockingScript: lockers.preferredLocker.lockerInfo.lockerLockingScript
			}
		}
		
	}

	private getChainIdNumber(asset: Asset, network: Network) {
		const chainId = cryptoassets[asset].chain;
		const chain = getChain(network, chainId);
		return Number(chain.network.chainId);
	}

  	private async getFees(quote: QuoteRequest) {
		const isTestnet = (quote.network === Network.Testnet) ? true: false;
		let calculatedFee: any;

		if (quote.from == 'BTC') {
			calculatedFee = await calculateFee({
				'amount': quote.amount, // assume that amount is in currency (not unit)
				'type': 'transfer', // bitcoin -> evm
				'targetNetworkConnectionInfo': this.getTargetNetworkConnectionInfo(quote.to, quote.network),
				'testnet': isTestnet
			});
		} else {
			calculatedFee = await calculateFee({
				'amount': quote.amount, // assume that amount is in currency (not unit)
				'type': 'burn', // evm -> bitcoin
				'targetNetworkConnectionInfo': this.getTargetNetworkConnectionInfo(quote.from, quote.network),
				'testnet': isTestnet
			});
		}

		return {
			teleporterFeeInBTC: calculatedFee.teleporterFeeInBTC || 0,
			teleporterPercentageFee: calculatedFee.teleporterPercentageFee || 0,
			totalFeeInBTC: calculatedFee.totalFeeInBTC || 0,
		}
	}

	private async getOutputAmount(
		amount: String, 
		from: Asset,
		to: Asset, 
		network: Network
	) {

		const api = new ethers.providers.InfuraProvider(
			this.getChainIdNumber(to, network), 
			buildConfig.infuraApiKey
		);

		// check that the liquidity pool exists
		const exchangeFactory = new ethers.Contract(
			this.config.QuickSwapFactoryAddress, UniswapV2Factory.abi, api
		);
		const pair = await exchangeFactory.getPair(this.getTokenAddress(from, network), this.getTokenAddress(to, network));
		let isDirectPair = true;
		if (pair == '0x0000000000000000000000000000000000000000') {
			isDirectPair = false
			// there is a pair between TELEBTC and WMATIC, so we check if there is pair between WMATIC and {to}
			let _pair = await exchangeFactory.getPair(this.getTokenAddress('WMATIC', network), this.getTokenAddress(to, network));
			if (_pair == '0x0000000000000000000000000000000000000000') {
				// no path exists
				throw createInternalError(CUSTOM_ERRORS.NotFound.Default);
			}
		}
		
		// get the output amount having input amount
		const exchangeRouter = new ethers.Contract(
			this.config.QuickSwapRouterAddress, 
			UniswapV2Router.abi, 
			api
		);
		
		let outputAmount;

		if (isDirectPair) {
			outputAmount = await exchangeRouter.getAmountsOut(
				amount,
				[this.getTokenAddress(from, network), this.getTokenAddress(to, network)]
			);
		} else {
			outputAmount = await exchangeRouter.getAmountsOut(
				amount,
				[this.getTokenAddress(from, network), this.getTokenAddress('WMATIC', network), this.getTokenAddress(to, network)]
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

	private getTargetNetworkConnectionInfo(to: Asset, network: Network) {
		const api = new ethers.providers.InfuraWebSocketProvider(
			this.getChainIdNumber(to, network), 
			buildConfig.infuraApiKey
		);

		let targetNetworkConnectionInfo = {
			web3: {
				url: api.connection.url,
			},
		}

		return targetNetworkConnectionInfo;
	}

	private async _getOpReturnData(
		quote: TeleSwapSwapHistoryItem, 
		requestType: TeleSwapTxTypes, 
		network: Network,
		recipientAddress: String // user's evm address on liquality
	) {
	
		const api = new ethers.providers.InfuraProvider(
			this.getChainIdNumber(quote.to, network), 
			buildConfig.infuraApiKey
		);

		let isExchange;

		// find chain id (we use same id for the testnet and mainnet)
		const chainId = this.getChainIdNumber(quote.to, quote.network);

		let appId;
		const speed = 0; // for now, we only support normal speed 
		let exchangeTokenAddress;
		let deadline;
		let outputAmount;
		const isFixedToken = true;

		// calculate teleporter percentage fee
		const percentageFee = (await this.getFees(
			{
				network: network, 
				from: 'BTC',
				to: quote.to, 
				amount: unitToCurrency(cryptoassets['BTC'], Number(quote.fromAmount))
			}
   		)).teleporterPercentageFee;

		if(requestType == TeleSwapTxTypes.SWAP) {
			isExchange = true;
			appId = EXCHANGE_APP_ID; // we use the first registered dex in teleswap
			exchangeTokenAddress = this.getTokenAddress(quote.to, network);
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