export type SplitEvent = { at: number; ratio: number }; // e.g. 2 means 2-for-1
export type CorpActions = {
  symbol: string;
  splits: SplitEvent[];
  updatedAt: number;
};
