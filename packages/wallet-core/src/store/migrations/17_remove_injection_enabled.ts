export const removeInjectionEnabled = {
  version: 17,
  migrate: async (state: any) => {
    delete state.injectionEnabled;
    return {
      ...state,
    };
  },
};
