import { kv } from "@vercel/kv";

export type PlotStatus = "available" | "sold" | "hold" | "not-for-sale";

export interface Plot {
  id: number;
  label: string;
  status: PlotStatus;
}

export const PLOTS_KEY = "marcherla:plots:v1";

const cycle: Record<PlotStatus, PlotStatus> = {
  available: "sold",
  sold: "hold",
  hold: "not-for-sale",
  "not-for-sale": "available",
};

export const generatePlots = (): Plot[] =>
  Array.from({ length: 183 }, (_, i) => ({
    id: i + 1,
    label: `Plot ${i + 1}`,
    status: "available",
  }));

export const getOrInitPlots = async (): Promise<Plot[]> => {
  const existing = await kv.get<Plot[]>(PLOTS_KEY);
  if (Array.isArray(existing) && existing.length > 0) {
    return existing;
  }

  const initial = generatePlots();
  await kv.set(PLOTS_KEY, initial);
  return initial;
};

export const togglePlotById = (plots: Plot[], id: number): Plot[] =>
  plots.map((p) => (p.id === id ? { ...p, status: cycle[p.status] } : p));
