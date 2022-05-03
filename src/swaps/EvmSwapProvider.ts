import { Client } from '@chainify/client';
import { EvmChainProvider, EvmTypes, Typechain } from '@chainify/evm';
import { toEthereumTxRequest } from '@chainify/evm/dist/lib/utils';
import { Transaction, TxStatus } from '@chainify/types';
import { chains } from '@liquality/cryptoassets';
import * as ethers from 'ethers';
import { SwapHistoryItem } from '../store/types';
import cryptoassets from '../utils/cryptoassets';
import { SwapProvider } from './SwapProvider';
import { BaseSwapProviderConfig, NextSwapActionRequest, SwapRequest, SwapStatus } from './types';

export interface EvmSwapHistoryItem extends SwapHistoryItem {
  approveTxHash: string;
  approveTx: Transaction<EvmTypes.EthersTransactionResponse>;
}

export interface EvmSwapProviderConfig extends BaseSwapProviderConfig {
  routerAddress: string;
}

export abstract class EvmSwapProvider extends SwapProvider {
  public config: EvmSwapProviderConfig;

  constructor(config: EvmSwapProviderConfig) {
    super(config);
  }

  async approve(swapRequest: SwapRequest, approveMax = true) {
    const { quote, network, walletId } = swapRequest;
    const fromAsset = cryptoassets[quote.from];
    const toAsset = cryptoassets[quote.to];

    // approve should be applicable only for EVM swaps on the same chain
    if (fromAsset.chain !== toAsset.chain) {
      return null;
    }

    // only ERC20 tokens allowed
    if (!fromAsset.contractAddress) {
      return null;
    }

    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId) as Client<EvmChainProvider>;
    const signer = client.wallet.getSigner();

    const tokenContractAddress = fromAsset.contractAddress;
    const tokenContract = Typechain.ERC20__factory.connect(tokenContractAddress, signer);

    const userAddressRaw = await this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
    const userAddress = chains[fromAsset.chain].formatAddress(userAddressRaw, network);

    const allowance = await tokenContract.allowance(userAddress, this.config.routerAddress);
    // if allowance is enough, no approve is needed
    if (allowance.gte(quote.fromAmount)) {
      return {
        status: 'APPROVE_CONFIRMED',
      };
    }

    const approveAmount = approveMax ? ethers.constants.MaxUint256 : ethers.BigNumber.from(quote.fromAmount);
    const approveTxData = await tokenContract.populateTransaction.approve(this.config.routerAddress, approveAmount);
    const approveTx = await client.wallet.sendTransaction(toEthereumTxRequest(approveTxData, quote.fee));

    return {
      status: 'WAITING_FOR_APPROVE_CONFIRMATIONS',
      approveTx,
      approveTxHash: approveTx.hash,
    };
  }

  async waitForApproveConfirmations(swapRequest: NextSwapActionRequest<EvmSwapHistoryItem>) {
    const { swap, network, walletId } = swapRequest;
    const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);

    try {
      const tx = await client.chain.getTransactionByHash(swap.approveTxHash);
      if (tx.status === TxStatus.Success) {
        return {
          endTime: Date.now(),
          status: 'APPROVE_CONFIRMED',
        };
      }
    } catch (e) {
      if (e.name === 'TxNotFoundError') {
        console.warn(e);
      } else {
        throw e;
      }
    }
  }

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
    };
  }
}
