export type ExplorerView = {
  tx?: string;
  address?: string;
  token?: string;
};

export type FeeMultiplier = {
  slowMultiplier: number;
  averageMultiplier: number;
  fastMultiplier: number;
};
