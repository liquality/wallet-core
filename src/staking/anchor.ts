import { AnchorEarn, CHAINS, DENOMS, NETWORKS, OperationError, Output } from '@anchor-protocol/anchor-earn';
import store from '../store';

const createAnchor = (): AnchorEarn => {
  const { mnemonic } = store.state.wallets[0];

  return new AnchorEarn({
    chain: CHAINS.TERRA,
    network: NETWORKS.COLUMBUS_5,
    mnemonic,
  });
};

export const getApy = async (): Promise<string> => {
  const anchorEarn = createAnchor();

  const marketInfo = await anchorEarn.market({
    currencies: [DENOMS.UST],
  });

  const { APY } = marketInfo.markets[0];

  const percentage = APY.split('.')[1];

  const formatted = percentage.slice(0, 2) + '.' + percentage.slice(2, 4);

  return formatted;
};

export const getDepositedAmount = async (): Promise<Number> => {
  const anchorEarn = createAnchor();

  const balanceInfo = await anchorEarn.balance({
    currencies: [DENOMS.UST],
  });

  return Number(balanceInfo.balances[0].deposit_balance);
};

export const makeDeposit = async (amount: string): Promise<Output | OperationError> => {
  const anchorEarn = createAnchor();

  return await anchorEarn.deposit({
    currency: DENOMS.UST,
    amount,
  });
};

export const makeWithdraw = async (amount: string): Promise<Output | OperationError> => {
  const anchorEarn = createAnchor();

  return await anchorEarn.withdraw({
    currency: DENOMS.UST,
    amount,
  });
};
