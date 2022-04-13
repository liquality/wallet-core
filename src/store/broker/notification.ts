import { prettyBalance } from '../../utils/coinFormatter';
import store from '../../store';
import { walletOptionsStore } from '../../walletOptions';

const SEND_STATUS_MAP = {
  WAITING_FOR_CONFIRMATIONS(item) {
    return {
      title: `New ${item.from} Transaction`,
      message: `Sending ${prettyBalance(item.amount, item.from)} ${item.from} to ${item.toAddress}`,
    };
  },
  Failed(item) {
    return {
      title: `${item.from} Transaction Failed`,
      message: `Failed to send ${prettyBalance(item.amount, item.from)} ${item.from} to ${item.toAddress}`,
    };
  },
  SUCCESS(item) {
    return {
      title: `${item.from} Transaction Confirmed`,
      message: `Sent ${prettyBalance(item.amount, item.from)} ${item.from} to ${item.toAddress}`,
    };
  },
};

export const createNotification = (config) =>
  walletOptionsStore.walletOptions.createNotification({
    type: 'basic',
    ...config,
  });

const createSwapNotification = (item) => {
  const swapProvider = store.getters.swapProvider(item.network, item.provider);
  const notificationFunction = swapProvider.statuses[item.status].notification;
  if (!notificationFunction) return;
  const notification = notificationFunction(item);

  return createNotification({
    title: `${item.from} -> ${item.to}`,
    ...notification,
  });
};

const createSendNotification = (item) => {
  if (!(item.status in SEND_STATUS_MAP)) return;
  const notification = SEND_STATUS_MAP[item.status](item);

  return createNotification({
    ...notification,
  });
};

export const createHistoryNotification = (item) => {
  if (item.type === 'SEND') return createSendNotification(item);
  else if (item.type === 'SWAP') return createSwapNotification(item);
};
