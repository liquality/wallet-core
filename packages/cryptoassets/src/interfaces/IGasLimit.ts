export interface IGasLimits {
  send: {
    native: number;
    nonNative?: number;
  };
}
