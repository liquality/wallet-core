import { Client } from '@chainify/client';
import { Transaction } from '@chainify/types';
import { getSwapProvider } from '../factory';
import { Asset, Network, SwapHistoryItem, WalletId } from '../store/types';
import { LiqualitySwapHistoryItem } from '../swaps/liquality/LiqualitySwapProvider';
import { ThorchainSwapHistoryItem } from '../swaps/thorchain/ThorchainSwapProvider';
import { UniswapSwapHistoryItem } from '../swaps/uniswap/UniswapSwapProvider';
import { getTransactionExplorerLink, isERC20 } from './asset';
import { getStep } from './history';

export enum TimelineSide {
  RIGHT = 'right',
  LEFT = 'left',
}

export enum TimelineAction {
  LOCK = 'lock',
  CLAIM = 'claim',
  REFUND = 'refund',
  RECEIVE = 'receive',
  APPROVE = 'approve',
  SWAP = 'swap',
}

export const ACTIONS_TERMS = {
  [TimelineAction.LOCK]: {
    default: 'Lock',
    pending: 'Locking',
    completed: 'Locked',
    failed: 'Failed Locking',
  },
  [TimelineAction.CLAIM]: {
    default: 'Claim',
    pending: 'Claiming',
    completed: 'Claimed',
    failed: 'Failed Claiming',
  },
  [TimelineAction.APPROVE]: {
    default: 'Approve Not Required',
    pending: 'Approving',
    completed: 'Approved',
    failed: 'Failed Approving',
  },
  [TimelineAction.RECEIVE]: {
    default: 'Receive',
    pending: 'Receiving',
    completed: 'Received',
    failed: 'Failed Receiving',
  },
  [TimelineAction.SWAP]: {
    default: 'Collect',
    pending: 'Collecting',
    completed: 'Collected',
    failed: 'Failed Collecting',
  },
  [TimelineAction.REFUND]: {
    default: 'Refund',
    pending: 'Refunding',
    completed: 'Refunded',
    failed: 'Failed Refunding',
  },
};

export interface TimelineStep {
  side: TimelineSide;
  pending: boolean;
  completed: boolean;
  title: string;
  tx?: Transaction;
}

export type GetClientFunction = (options: { walletId: WalletId; network: Network; asset: Asset }) => Client;

export type GetStepFunction = (completed: boolean, pending: boolean, side: TimelineSide) => Promise<TimelineStep>;

export interface TimelineTransaction extends Transaction {
  asset: string;
  explorerLink: string;
}

export async function getSwapTimeline(item: SwapHistoryItem, getClient: GetClientFunction) {
  function getToAssetWhenSwappingFromNative() {
    if (item.provider.includes('liqualityBoost') && !isERC20(item.from)) {
      return item.bridgeAsset!;
    }
    return item.to;
  }
  // get to asset when liquality boost provider is swapping from ERC20 to Native
  function getToAssetWhenSwappingFromERC20() {
    if (item.provider.includes('liqualityBoost') && isERC20(item.from)) {
      return item.bridgeAsset!;
    }
    return item.to;
  }
  // get from asset when liquality boost provider is swapping from ERC20 to Native
  function getFromAssetWhenSwappingFromERC20() {
    if (item.provider.includes('liqualityBoost') && isERC20(item.from)) {
      return item.bridgeAsset!;
    }
    return item.from;
  }

  async function getTransaction(hash: string, asset: Asset, defaultTx: Transaction | null) {
    const client = getClient({
      network: item.network,
      walletId: item.walletId,
      asset,
    });
    const transaction = (await client.chain.getTransactionByHash(hash)) || defaultTx;
    const timelineTransacstion: TimelineTransaction = {
      ...transaction,
      explorerLink: getTransactionExplorerLink(hash, asset, item.network),
      asset,
    };

    return timelineTransacstion;
  }
  async function getTransactionStep(
    completed: boolean,
    pending: boolean,
    side: TimelineSide,
    hash: string,
    defaultTx: Transaction | null,
    asset: Asset,
    action: TimelineAction
  ) {
    const step: TimelineStep = {
      side,
      pending,
      completed,
      title: pending ? `${ACTIONS_TERMS[action].pending} ${asset}` : `${ACTIONS_TERMS[action].default} ${asset}`,
    };
    if (hash) {
      const tx = await getTransaction(hash, asset, defaultTx);
      if (tx && tx.confirmations && tx.confirmations > 0) {
        if (tx.status === 'FAILED') {
          step.title = `${ACTIONS_TERMS[action].failed} ${asset}`;
        } else {
          step.title = `${ACTIONS_TERMS[action].completed} ${asset}`;
        }
      } else {
        step.title = `${ACTIONS_TERMS[action].pending} ${asset}`;
      }
      step.tx = tx || { hash: hash };
    }
    return step;
  }
  async function getInitiationStep(completed: boolean, pending: boolean, side: TimelineSide) {
    return getTransactionStep(
      completed,
      pending,
      side,
      (item as LiqualitySwapHistoryItem).fromFundHash,
      (item as LiqualitySwapHistoryItem).fromFundTx,
      getFromAssetWhenSwappingFromERC20(),
      TimelineAction.LOCK
    );
  }
  async function getAgentInitiationStep(completed: boolean, pending: boolean, side: TimelineSide) {
    return getTransactionStep(
      completed,
      pending,
      side,
      (item as LiqualitySwapHistoryItem).toFundHash,
      null,
      getToAssetWhenSwappingFromNative(),
      TimelineAction.LOCK
    );
  }
  async function getClaimRefundStep(completed: boolean, pending: boolean, side: TimelineSide) {
    return (item as LiqualitySwapHistoryItem).refundHash
      ? getTransactionStep(
          completed,
          pending,
          side,
          (item as LiqualitySwapHistoryItem).refundHash,
          (item as LiqualitySwapHistoryItem).refundTx,
          item.from,
          TimelineAction.REFUND
        )
      : getTransactionStep(
          completed,
          pending,
          side,
          (item as LiqualitySwapHistoryItem).toClaimHash,
          (item as LiqualitySwapHistoryItem).toClaimTx,
          getToAssetWhenSwappingFromNative(),
          TimelineAction.CLAIM
        );
  }
  async function getApproveStep(completed: boolean, pending: boolean, side: TimelineSide) {
    return getTransactionStep(
      completed,
      pending,
      side,
      (item as UniswapSwapHistoryItem).approveTxHash,
      null,
      item.from,
      TimelineAction.APPROVE
    );
  }
  async function getSwapStep(completed: boolean, pending: boolean, side: TimelineSide) {
    return (item as LiqualitySwapHistoryItem).refundHash
      ? {
          side: TimelineSide.RIGHT,
          pending: false,
          completed: true,
          title: `${ACTIONS_TERMS.swap.pending} ${item.to} Interrupted`,
        }
      : getTransactionStep(
          completed,
          pending,
          side,
          (item as UniswapSwapHistoryItem).swapTxHash,
          (item as UniswapSwapHistoryItem).swapTx,
          getToAssetWhenSwappingFromERC20(),
          TimelineAction.SWAP
        );
  }
  async function getReceiveStep(completed: boolean, pending: boolean, side: TimelineSide) {
    return item.status === 'REFUNDED'
      ? getTransactionStep(
          completed,
          pending,
          side,
          (item as ThorchainSwapHistoryItem).receiveTxHash,
          null,
          item.from,
          TimelineAction.REFUND
        )
      : getTransactionStep(
          completed,
          pending,
          side,
          (item as ThorchainSwapHistoryItem).receiveTxHash,
          null,
          item.to,
          TimelineAction.RECEIVE
        );
  }

  const timeline = [];
  const supportedSteps: { [status: string]: GetStepFunction } = {
    SWAP: getSwapStep,
    APPROVE: getApproveStep,
    RECEIVE: getReceiveStep,
    INITIATION: getInitiationStep,
    AGENT_INITIATION: getAgentInitiationStep,
    CLAIM_OR_REFUND: getClaimRefundStep,
  };
  const swapProvider = getSwapProvider(item.network, item.provider);
  const timelineDiagramSteps = swapProvider.timelineDiagramSteps;
  const steps = timelineDiagramSteps.map((step) => supportedSteps[step]);

  for (let i = 0; i < steps.length; i++) {
    const completed = getStep(item) > i;
    const pending = getStep(item) === i;
    const side = i % 2 === 0 ? TimelineSide.LEFT : TimelineSide.RIGHT;
    const step = await steps[i](completed, pending, side);
    timeline.push(step);
  }
}
