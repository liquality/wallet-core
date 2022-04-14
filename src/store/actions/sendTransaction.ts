import BN from 'bignumber.js';
import { v4 as uuidv4 } from 'uuid';
import { createHistoryNotification } from '../broker/notification';

export const sendTransaction = async (
  { dispatch, commit, getters },
  { network, walletId, accountId, asset, to, amount, data, fee, gas, feeLabel, fiatRate }
) => {
  const client = getters.client({
    network,
    walletId,
    asset,
    accountId,
  });

  const originalEstimateGas = client._providers[0].estimateGas;
  if (gas) {
    client._providers[0].estimateGas = async () => {
      return gas;
    };
  }

  let tx;
  try {
    tx = await client.chain.sendTransaction({
      to,
      value: new BN(amount),
      data,
      fee,
    });
  } finally {
    client._providers[0].estimateGas = originalEstimateGas;
  }

  const transaction = {
    id: uuidv4(),
    type: 'SEND',
    network,
    walletId,
    to: asset,
    from: asset,
    toAddress: to,
    amount: new BN(amount).toNumber(),
    fee,
    tx,
    txHash: tx.hash,
    startTime: Date.now(),
    status: 'WAITING_FOR_CONFIRMATIONS',
    accountId,
    feeLabel,
    fiatRate,
  };

  commit('NEW_TRASACTION', {
    network,
    walletId,
    accountId,
    transaction,
  });

  dispatch('performNextAction', {
    network,
    walletId,
    id: transaction.id,
    accountId,
  });

  createHistoryNotification(transaction);

  return tx;
};
