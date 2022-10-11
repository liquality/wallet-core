import { CUSTOM_ERRORS, wrapCustomError } from '@liquality/error-parser';
import moment from 'moment';
import { getSwapProvider } from '../factory/swap';
import { HistoryItem, SendStatus, TransactionType } from '../store/types';

export const SEND_STATUS_STEP_MAP = {
  [SendStatus.WAITING_FOR_CONFIRMATIONS]: 0,
  [SendStatus.SUCCESS]: 1,
  [SendStatus.FAILED]: 2,
};

export const SEND_STATUS_LABEL_MAP = {
  [SendStatus.WAITING_FOR_CONFIRMATIONS]: 'Pending',
  [SendStatus.SUCCESS]: 'Completed',
  [SendStatus.FAILED]: 'Failed',
};

export function getStatusLabel(item: HistoryItem) {
  if (item.type === TransactionType.NFT) {
    return SEND_STATUS_LABEL_MAP[item.status] || '';
  }
  if (item.type === TransactionType.Send) {
    return SEND_STATUS_LABEL_MAP[item.status] || '';
  }
  if (item.type === TransactionType.Swap) {
    const swapProvider = getSwapProvider(item.network, item.provider);
    return (
      swapProvider.statuses[item.status].label
        .replace('{from}', item.from)
        .replace('{to}', item.to)
        .replace('{bridgeAsset}', item.bridgeAsset || '') || ''
    );
  }
}

export function getStep(item: HistoryItem) {
  const itemType = item.type;
  if (itemType === TransactionType.NFT) {
    return SEND_STATUS_STEP_MAP[item.status];
  }
  if (itemType === TransactionType.Send) {
    return SEND_STATUS_STEP_MAP[item.status];
  }
  if (itemType === TransactionType.Swap) {
    const swapProvider = getSwapProvider(item.network, item.provider);
    return swapProvider.statuses[item.status].step;
  }

  throw wrapCustomError(CUSTOM_ERRORS.Invalid.TransactionType(itemType));
}

export const ACTIVITY_FILTER_TYPES = {
  SWAP: {
    label: 'Swap',
    icon: 'swap',
  },
  NFT: {
    label: 'NFT',
    icon: 'nft',
  },
  SEND: {
    label: 'Send',
    icon: 'send',
  },
  RECEIVE: {
    label: 'Receive',
    icon: 'receive',
  },
};

export const ACTIVITY_STATUSES = {
  PENDING: {
    label: 'Pending',
    icon: 'pending',
  },
  COMPLETED: {
    label: 'Completed',
    icon: 'completed',
  },
  FAILED: {
    label: 'Failed',
    icon: 'failed',
  },
  NEEDS_ATTENTION: {
    label: 'Needs Attention',
    icon: 'needs_attention',
  },
  REFUNDED: {
    label: 'Refunded',
    icon: 'refunded',
  },
};

export const SEND_STATUS_FILTER_MAP = {
  WAITING_FOR_CONFIRMATIONS: 'PENDING',
  SUCCESS: 'COMPLETED',
  FAILED: 'FAILED',
};

export const applyActivityFilters = (
  activity: HistoryItem[],
  filters: { types: TransactionType[]; statuses: string[]; dates: { start: string; end: string } }
) => {
  const { types, statuses, dates } = filters;
  let data = [...activity];
  if (types.length > 0) {
    data = data.filter((i) => types.includes(i.type));
  }

  if (statuses.length > 0) {
    data = data.filter((i) => {
      if (i.type === 'SWAP') {
        const swapProvider = getSwapProvider(i.network, i.provider);
        return statuses.includes(swapProvider.statuses[i.status].filterStatus);
      }

      if (i.type === 'SEND') {
        return statuses.includes(SEND_STATUS_FILTER_MAP[i.status]);
      }

      return true;
    });
  }

  if (dates.start) {
    const filter = moment(dates.start);
    data = data.filter((i) => {
      const start = moment(i.startTime);
      return filter >= start;
    });
  }

  if (dates.end) {
    const filter = moment(dates.end);
    data = data.filter((i) => {
      const end = moment(i.startTime);
      return filter <= end;
    });
  }

  return data;
};
