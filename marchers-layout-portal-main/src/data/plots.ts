export type PlotStatus = "available" | "sold" | "hold" | "not-for-sale";

export interface Plot {
  id: number;
  label: string;
  status: PlotStatus;
}

export const generatePlots = (): Plot[] => {
  return Array.from({ length: 183 }, (_, i) => ({
    id: i + 1,
    label: `Plot ${i + 1}`,
    status: "available" as PlotStatus,
  }));
};
