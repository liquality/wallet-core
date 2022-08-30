export interface IGasLimits {
  send: {
    native: number;
    nonNative?: number;
  };
  sendL1?: {
    native: number;
    nonNative?: number;
  };
}

export type GasLimitsType = keyof IGasLimits;
