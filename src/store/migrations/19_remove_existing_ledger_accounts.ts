import { Account, AccountType } from "../types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const removeExistingLedgerAccounts = {
  version: 19,
  migrate: async (state: any) => {
    const accounts: { [key: string]: any }  = {};

    for (const walletId in state.accounts) {
      if (!accounts[walletId]) {
        accounts[walletId] = {}
      }
      for (const network in state.accounts[walletId]) {
        accounts[walletId][network] = state.accounts[walletId][network].filter((a: Account) => {
          return [AccountType.BitcoinLedgerNativeSegwit, AccountType.BitcoinLedgerLegacy].includes(a.type)
        })
      }
    }
    
    const newState = {
      ...state,
      whatsNewModalVersion: state.watsNewModalVersion || '',
      accounts
    }
    delete newState.watsNewModalVersion;
    return newState;
  },
};
