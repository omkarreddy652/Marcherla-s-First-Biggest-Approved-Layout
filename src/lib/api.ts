export const getApiBase = () => {
  return (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");
};

type FetchOptions = RequestInit & { query?: Record<string, string | number | undefined> };

const buildQuery = (q?: Record<string, string | number | undefined>) => {
  if (!q) return "";
  const params = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v !== undefined) params.set(k, String(v));
  });
  const s = params.toString();
  return s ? `?${s}` : "";
};

export async function apiFetch<T = any>(path: string, opts: FetchOptions = {}): Promise<T> {
  const base = getApiBase();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  let finalPath = normalizedPath;
  if (base.endsWith("/api") && normalizedPath.startsWith("/api/")) {
    finalPath = normalizedPath.slice(4); // "/api/plots" => "/plots"
  }

  const url = `${base}${finalPath}${buildQuery(opts.query)}`;

  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}
