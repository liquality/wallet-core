import BN from 'bignumber.js'
import { v4 as uuidv4 } from 'uuid'
import JSBI from 'jsbi'
import * as ethers from 'ethers'

import UniswapV2Router from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import { Token, CurrencyAmount, Fraction, Percent } from '@uniswap/sdk-core'
import ERC20 from '@uniswap/v2-core/build/ERC20.json'
import { ChainId, chains, currencyToUnit, unitToCurrency } from '@liquality/cryptoassets'
import cryptoassets from '@/utils/cryptoassets'
import { ChainNetworks } from '@/utils/networks'

import { isERC20 } from '../../utils/asset'
import { prettyBalance } from '../../utils/coinFormatter'
import { withInterval, withLock } from '../../store/actions/performNextAction/utils'
import { SwapProvider } from '../SwapProvider'
import { BestRouteService } from './BestRouteService'
import { blindexConfig } from './BlindexConfig'

const SWAP_DEADLINE = 30 * 60 // 30 minutes
const DECIMALS = 18
const RSK_RPC_URL = 'https://public-node.rsk.co'
const SLIPPAGE = 200 // 2%

class BlindexSwapProvider extends SwapProvider {
  constructor(config) {
    super(config)
    this._apiCache = {}
    this.bestRouteService = new BestRouteService()
    this.wrbtcAddress = blindexConfig.ERC20_INFO.find((x) => x.symbol === 'WRBTC').address
    this.nativeTokenSymbol = chains[ChainId.Rootstock].nativeAsset //RBTC
    this.availableTokenSymbols = blindexConfig.ERC20_INFO.map((entry) =>
      entry.symbol === 'WRBTC' ? this.nativeTokenSymbol : entry.symbol
    )
  }

  async getSupportedPairs() {
    return []
  }

  getApi(network, asset) {
    const fromChain = cryptoassets[asset].chain
    const chainId = ChainNetworks[fromChain][network].chainId
    if (chainId in this._apiCache) {
      return this._apiCache[chainId]
    } else {
      const api = new ethers.providers.StaticJsonRpcProvider(RSK_RPC_URL)
      this._apiCache[chainId] = api
      return api
    }
  }

  getToken(chainId, asset) {
    const assetData = cryptoassets[asset]
    if (asset === this.nativeTokenSymbol) {
      assetData.contractAddress = this.wrbtcAddress
    }

    return new Token(
      chainId,
      assetData.contractAddress,
      assetData.decimals,
      assetData.code,
      assetData.name
    )
  }

  getMinimumOutput(outputAmount) {
    const slippageTolerance = new Percent(SLIPPAGE, '10000') // 2%
    const slippageAdjustedAmountOut = new Fraction(JSBI.BigInt(1))
      .add(slippageTolerance)
      .invert()
      .multiply(outputAmount.quotient).quotient
    return CurrencyAmount.fromRawAmount(outputAmount.currency, slippageAdjustedAmountOut)
  }

  /**
   * Get a quote for the specified parameters
   * @param {{ network, from, to, amount }} options
   */
  // eslint-disable-next-line no-unused-vars
  async getQuote({ network, from, to, amount }) {
    if (
      network != 'mainnet' ||
      !this.availableTokenSymbols.includes(from) ||
      !this.availableTokenSymbols.includes(to)
    ) {
      return null
    }

    const fromContractAddress =
      from === this.nativeTokenSymbol ? this.wrbtcAddress : cryptoassets[from].contractAddress
    const toContractAddress =
      to === this.nativeTokenSymbol ? this.wrbtcAddress : cryptoassets[to].contractAddress
    const bestRouteWithValOut = await this.calcBestRoute(
      network,
      to,
      amount,
      fromContractAddress,
      toContractAddress
    )
    const amountOut_d18 = this.ethersBigNumberToDecimal(bestRouteWithValOut.finalAmount, DECIMALS)
    return {
      from,
      to,
      fromAmount: currencyToUnit(cryptoassets[from], BN(amount)),
      toAmount: currencyToUnit(cryptoassets[to], BN(amountOut_d18))
    }
  }

  /**
   * Create a new swap for the given quote
   * @param {{ network, walletId, quote }} options
   */
  // eslint-disable-next-line no-unused-vars
  async newSwap({ network, walletId, quote }) {
    const approvalRequired = isERC20(quote.from)
    const updates = approvalRequired
      ? await this.approveTokens({ network, walletId, quote })
      : await this.sendSwap({ network, walletId, quote })

    return {
      id: uuidv4(),
      fee: quote.fee,
      slippage: SLIPPAGE,
      ...updates
    }
  }

  async sendSwap({ network, walletId, quote }) {
    const txData = await this.buildSwapTx({ network, walletId, quote })
    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId)

    await this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.')
    const swapTx = await client.chain.sendTransaction(txData)

    return {
      status: 'WAITING_FOR_SWAP_CONFIRMATIONS',
      swapTx,
      swapTxHash: swapTx.hash
    }
  }

  getChecksumAddressFromAddress(address) {
    return ethers.utils.getAddress(address.toLowerCase())
  }

  async requiresApproval({ network, walletId, quote }) {
    if (!isERC20(quote.from)) return false

    const fromChain = cryptoassets[quote.from].chain
    const api = this.getApi(network, quote.from)
    const erc20 = new ethers.Contract(cryptoassets[quote.from].contractAddress, ERC20.abi, api)

    const fromAddressRaw = await this.getSwapAddress(
      network,
      walletId,
      quote.from,
      quote.fromAccountId
    )
    const fromAddress = this.getChecksumAddressFromAddress(
      chains[fromChain].formatAddress(fromAddressRaw, network)
    )
    const allowance = await erc20.allowance(fromAddress, this.config.routerAddress)
    const inputAmount = ethers.BigNumber.from(BN(quote.fromAmount).toFixed())
    if (allowance.gte(inputAmount)) {
      return false
    }

    return true
  }

  async buildApprovalTx({ network, walletId, quote }) {
    const api = this.getApi(network, quote.from)
    const erc20 = new ethers.Contract(cryptoassets[quote.from].contractAddress, ERC20.abi, api)

    const inputAmount = ethers.BigNumber.from(BN(quote.fromAmount).toFixed())
    const inputAmountHex = inputAmount.toHexString()
    const encodedData = erc20.interface.encodeFunctionData('approve', [
      this.config.routerAddress,
      inputAmountHex
    ])

    const fromChain = cryptoassets[quote.from].chain
    const fromAddressRaw = await this.getSwapAddress(
      network,
      walletId,
      quote.from,
      quote.fromAccountId
    )
    const fromAddress = this.getChecksumAddressFromAddress(
      chains[fromChain].formatAddress(fromAddressRaw, network)
    )

    return {
      from: fromAddress, // Required for estimation only (not used in chain client)
      to: cryptoassets[quote.from].contractAddress,
      value: 0,
      data: encodedData,
      fee: quote.fee
    }
  }

  async approveTokens({ network, walletId, quote }) {
    const requiresApproval = await this.requiresApproval({
      network,
      walletId,
      quote
    })
    if (!requiresApproval) {
      return {
        status: 'APPROVE_CONFIRMED'
      }
    }

    const txData = await this.buildApprovalTx({ network, walletId, quote })

    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId)
    const approveTx = await client.chain.sendTransaction(txData)

    return {
      status: 'WAITING_FOR_APPROVE_CONFIRMATIONS',
      approveTx,
      approveTxHash: approveTx.hash
    }
  }

  async buildSwapTx({ network, walletId, quote }) {
    const toChain = cryptoassets[quote.to].chain
    const chainId = ChainNetworks[toChain][network].chainId

    const toToken = this.getToken(chainId, quote.to)

    const outputAmount = CurrencyAmount.fromRawAmount(toToken, BN(quote.toAmount).toFixed())
    const minimumOutput = this.getMinimumOutput(outputAmount)

    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId)
    const blockHeight = await client.chain.getBlockHeight()
    const currentBlock = await client.chain.getBlockByNumber(blockHeight)

    const deadline = currentBlock.timestamp + SWAP_DEADLINE
    const minimumOutputInUnit = currencyToUnit(cryptoassets[quote.to], BN(minimumOutput.toExact()))
    const inputAmountHex = ethers.BigNumber.from(BN(quote.fromAmount).toFixed()).toHexString()
    const outputAmountHex = ethers.BigNumber.from(minimumOutputInUnit.toFixed()).toHexString()

    const toAddressRaw = await this.getSwapAddress(network, walletId, quote.to, quote.toAccountId)
    const toAddress = this.getChecksumAddressFromAddress(
      chains[toChain].formatAddress(toAddressRaw, network)
    )

    const api = this.getApi(network, quote.to)
    const router = new ethers.Contract(this.config.routerAddress, UniswapV2Router.abi, api)

    let encodedData
    if (isERC20(quote.from)) {
      const swapTokensMethod = isERC20(quote.to)
        ? 'swapExactTokensForTokens'
        : 'swapExactTokensForETH'
      encodedData = router.interface.encodeFunctionData(swapTokensMethod, [
        inputAmountHex,
        outputAmountHex,
        this.bestRoute,
        toAddress,
        deadline
      ])
    } else {
      encodedData = router.interface.encodeFunctionData('swapExactETHForTokens', [
        outputAmountHex,
        this.bestRoute,
        toAddress,
        deadline
      ])
    }

    const value = isERC20(quote.from) ? 0 : BN(quote.fromAmount)

    const fromChain = cryptoassets[quote.from].chain
    const fromAddressRaw = await this.getSwapAddress(
      network,
      walletId,
      quote.from,
      quote.fromAccountId
    )
    const fromAddress = this.getChecksumAddressFromAddress(
      chains[fromChain].formatAddress(fromAddressRaw, network)
    )

    return {
      from: fromAddress, // Required for estimation only (not used in chain client)
      to: this.config.routerAddress,
      value,
      data: encodedData,
      fee: quote.fee
    }
  }

  /**
   * Estimate the fees for the given parameters
   * @param {{ network, walletId, asset, fromAccountId, toAccountId, txType, amount, feePrices[] }} options
   * @return Object of key feePrice and value fee
   */
  // eslint-disable-next-line no-unused-vars
  async estimateFees({ network, walletId, asset, txType, quote, feePrices }) {
    if (txType !== BlindexSwapProvider.fromTxType) throw new Error(`Invalid tx type ${txType}`)

    const nativeAsset = chains[cryptoassets[asset].chain].nativeAsset
    const account = this.getAccount(quote.fromAccountId)
    const client = this.getClient(network, walletId, quote.from, account?.type)

    let gasLimit = 0
    if (await this.requiresApproval({ network, walletId, quote })) {
      const approvalTx = await this.buildApprovalTx({
        network,
        walletId,
        quote
      })
      const rawApprovalTx = {
        from: approvalTx.from,
        to: approvalTx.to,
        data: approvalTx.data,
        value: '0x' + approvalTx.value.toString(16)
      }

      gasLimit += await client.getMethod('estimateGas')(rawApprovalTx)
    }

    const swapTx = await this.buildSwapTx({ network, walletId, quote })
    const rawSwapTx = {
      from: swapTx.from,
      to: swapTx.to,
      data: swapTx.data,
      value: '0x' + swapTx.value.toString(16)
    }
    gasLimit += await client.getMethod('estimateGas')(rawSwapTx)

    const fees = {}
    for (const feePrice of feePrices) {
      const gasPrice = BN(feePrice).times(1e9) // ETH fee price is in gwei
      const fee = BN(gasLimit).times(1.1).times(gasPrice)
      fees[feePrice] = unitToCurrency(cryptoassets[nativeAsset], fee)
    }
    return fees
  }

  async waitForApproveConfirmations({ swap, network, walletId }) {
    const client = this.getClient(network, walletId, swap.from, swap.fromAccountId)

    try {
      const tx = await client.chain.getTransactionByHash(swap.approveTxHash)
      if (tx && tx.confirmations > 0) {
        return {
          endTime: Date.now(),
          status: 'APPROVE_CONFIRMED'
        }
      }
    } catch (e) {
      if (e.name === 'TxNotFoundError') console.warn(e)
      else throw e
    }
  }

  async waitForSwapConfirmations({ swap, network, walletId }) {
    const client = this.getClient(network, walletId, swap.from, swap.fromAccountId)

    try {
      const tx = await client.chain.getTransactionByHash(swap.swapTxHash)
      if (tx && tx.confirmations > 0) {
        // Check transaction status - it may fail due to slippage
        const { status } = await client.getMethod('getTransactionReceipt')(swap.swapTxHash)
        this.updateBalances({ network, walletId, assets: [swap.from] })
        return {
          endTime: Date.now(),
          status: Number(status) === 1 ? 'SUCCESS' : 'FAILED'
        }
      }
    } catch (e) {
      if (e.name === 'TxNotFoundError') console.warn(e)
      else throw e
    }
  }

  /**
   * This hook is called when state updates are required
   * @param {object} store
   * @param {{ network, walletId, swap }}
   * @return updates An object representing updates to the current swap in the history
   */
  // eslint-disable-next-line no-unused-vars
  async performNextSwapAction(store, { network, walletId, swap }) {
    let updates

    switch (swap.status) {
      case 'WAITING_FOR_APPROVE_CONFIRMATIONS':
        updates = await withInterval(async () =>
          this.waitForApproveConfirmations({ swap, network, walletId })
        )
        break
      case 'APPROVE_CONFIRMED':
        updates = await withLock(
          store,
          { item: swap, network, walletId, asset: swap.from },
          async () => this.sendSwap({ quote: swap, network, walletId })
        )
        break
      case 'WAITING_FOR_SWAP_CONFIRMATIONS':
        updates = await withInterval(async () =>
          this.waitForSwapConfirmations({ swap, network, walletId })
        )
        break
    }

    return updates
  }

  async calcBestRoute(network, to, amount, leftToken, rightToken) {
    if (!leftToken || !rightToken || !parseFloat(amount)) {
      this.bestRoute = []
      return undefined
    }

    const api = this.getApi(network, to)
    const router = new ethers.Contract(this.config.routerAddress, UniswapV2Router.abi, api)
    const amount_d18 = this.numberToEthersBigNumberFixed(amount, DECIMALS)
    const bestRoute = await this.bestRouteService.getBestRoute(
      router,
      amount_d18,
      leftToken,
      rightToken
    )
    this.bestRoute = bestRoute.route
    return bestRoute
  }

  numberToEthersBigNumberFixed(n, decimals) {
    const precision = 1e6
    n = Math.round(n * precision)
    return ethers.BigNumber.from(10).pow(decimals).mul(n).div(precision)
  }

  ethersBigNumberToDecimal(n, decimals) {
    return Number(n.toString()) / 10 ** decimals
  }

  static txTypes = {
    SWAP: 'SWAP'
  }

  static statuses = {
    WAITING_FOR_APPROVE_CONFIRMATIONS: {
      step: 0,
      label: 'Approving {from}',
      filterStatus: 'PENDING',
      notification(swap) {
        return {
          message: `Approving ${swap.from}`
        }
      }
    },
    APPROVE_CONFIRMED: {
      step: 1,
      label: 'Swapping {from}',
      filterStatus: 'PENDING'
    },
    WAITING_FOR_SWAP_CONFIRMATIONS: {
      step: 1,
      label: 'Swapping {from}',
      filterStatus: 'PENDING',
      notification() {
        return {
          message: 'Engaging Blindex'
        }
      }
    },
    SUCCESS: {
      step: 2,
      label: 'Completed',
      filterStatus: 'COMPLETED',
      notification(swap) {
        return {
          message: `Swap completed, ${prettyBalance(swap.toAmount, swap.to)} ${
            swap.to
          } ready to use`
        }
      }
    },
    FAILED: {
      step: 2,
      label: 'Swap Failed',
      filterStatus: 'REFUNDED',
      notification() {
        return {
          message: 'Swap failed'
        }
      }
    }
  }

  static fromTxType = BlindexSwapProvider.txTypes.SWAP
  static toTxType = null

  static timelineDiagramSteps = ['APPROVE', 'SWAP']

  static totalSteps = 3
}

export { BlindexSwapProvider }
