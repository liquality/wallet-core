export const useLedgerLiveDefault = {
  // set useLedgerLive default to false
  version: 6,
  migrate: async (state: any) => {
    return { ...state, useLedgerLive: false };
  },
};
