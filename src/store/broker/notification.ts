import store from '../../store';
import { Notification } from '../../types';
import { prettyBalance } from '../../utils/coinFormatter';
import { walletOptionsStore } from '../../walletOptions';
import { HistoryItem, SendHistoryItem, SwapHistoryItem } from '../types';

const SEND_STATUS_MAP = {
  WAITING_FOR_CONFIRMATIONS(item: SendHistoryItem) {
    return {
      title: `New ${item.from} Transaction`,
      message: `Sending ${prettyBalance(item.amount, item.from)} ${item.from} to ${item.toAddress}`,
    };
  },
  FAILED(item: SendHistoryItem) {
    return {
      title: `${item.from} Transaction Failed`,
      message: `Failed to send ${prettyBalance(item.amount, item.from)} ${item.from} to ${item.toAddress}`,
    };
  },
  SUCCESS(item: SendHistoryItem) {
    return {
      title: `${item.from} Transaction Confirmed`,
      message: `Sent ${prettyBalance(item.amount, item.from)} ${item.from} to ${item.toAddress}`,
    };
  },
};

export const createNotification = async (config: Notification) =>
  walletOptionsStore.walletOptions.createNotification(config);

const createSwapNotification = (item: SwapHistoryItem) => {
  const swapProvider = store.getters.swapProvider(item.network, item.provider);
  const notificationFunction = swapProvider.statuses[item.status].notification;
  if (!notificationFunction) return;
  const notification = notificationFunction(item);

  return createNotification({
    title: `${item.from} -> ${item.to}`,
    ...notification,
  });
};

const createSendNotification = (item: SendHistoryItem) => {
  if (!(item.status in SEND_STATUS_MAP)) return;
  const notification = SEND_STATUS_MAP[item.status](item);

  return createNotification({
    ...notification,
  });
};

export const createHistoryNotification = (item: HistoryItem) => {
  if (item.type === 'SEND') return createSendNotification(item);
  else if (item.type === 'SWAP') return createSwapNotification(item);
};
