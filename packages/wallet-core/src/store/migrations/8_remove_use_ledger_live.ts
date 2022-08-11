export const removeUseLedgerLive = {
  // remove useLedgerLive
  version: 8,
  migrate: async (state: any) => {
    delete state.useLedgerLive;
    return { ...state, usbBridgeWindowsId: 0 };
  },
};
