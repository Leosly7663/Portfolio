// app/utils/apiClient.ts
export async function recomputeBundles(): Promise<void> {
  const res = await fetch("/utils/recompute", { method: "POST" });
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.error || `Recompute failed (${res.status})`);
  }
}

// optional helpers if you expand later
export async function lookupQuote(symbol: string) {
  const sym = symbol.trim().toUpperCase();
  const res = await fetch(`/utils/StockQuotes?symbols=${encodeURIComponent(sym)}`);
  if (!res.ok) throw new Error(`Quote lookup failed (${res.status})`);
  const json = await res.json();
  return json?.quotes?.[sym] ?? null;
}

async function safeJson(r: Response) {
  try { return await r.json(); } catch { return null; }
}
export type CreateBundleRequest = {
  name: string;
  type: "Live" | "Demo";
  assets: {
    ticker: string;
    shares?: number;
    open_price_USD?: number | null;
    inception_date?: string; // ISO (for Demo you can set per-asset)
  }[];
};

export async function createBundleApi(payload: CreateBundleRequest) {
  const res = await fetch("/utils/bundles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || `Create failed (${res.status})`);
  return json as { id: number };
}
