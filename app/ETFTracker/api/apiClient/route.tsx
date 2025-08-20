// app/utils/apiClient.ts

// ---- Public API -------------------------------------------------------------

export async function recomputeBundles(): Promise<void> {
  const res = await fetch("ETFTracker/api/recompute", { method: "POST" });
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.error || `Recompute failed (${res.status})`);
  }
}

export type CreateBundleRequest = {
  name: string;
  bundle_type: "Spot" | "Managed";
  assets: {
    ticker: string;
    shares?: number;
    open_price_usd?: number | null;
    inception_date?: string; // ISO (for Managed you can set per-asset)
  }[];
};

export async function createBundleApi(payload: CreateBundleRequest) {
  const res = await fetch("ETFTracker/api/bundles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json?.error || `Create failed (${res.status})`);
  return json as { id: number };
}

/**
 * Normalized quote shape used across the app.
 */
export type Quote = {
  ticker: string;
  price: number | null;
  currency: string | null;
  previousClose: number | null;
};

/**
 * DRY shared fetcher: returns a normalized Quote for a single symbol.
 * Both the self-contained button and any hooks can use this.
 */
export async function getQuote(symbol: string): Promise<Quote> {
  const sym = symbol.trim().toUpperCase();
  if (!sym) throw new Error("Symbol required");

  // Use the same backend you already have:
  const raw = await lookupQuote(sym); // may return provider-shaped object or null
  if (!raw) {
    throw new Error(`No quote for ${sym}`);
  }

  // Normalize possible backend fields to a consistent shape
  const price =
    numOrNull(raw.price) ??
    numOrNull(raw.last) ??
    numOrNull(raw.lastPrice) ??
    null;

  const previousClose =
    numOrNull(raw.previousClose) ??
    numOrNull(raw.prevClose) ??
    numOrNull(raw.closePrev) ??
    null;

  const currency =
    strOrNull(raw.currency) ??
    strOrNull(raw.curr) ??
    strOrNull(raw.fx) ??
    null;

  return {
    ticker: strOrNull(raw.ticker) ?? sym,
    price,
    currency,
    previousClose,
  };
}

// ---- Legacy/compat helpers (kept, used by getQuote) ------------------------

/**
 * Raw lookup to your existing endpoint. Returns the provider's quote object
 * (shape may vary) or null if not found. Prefer using getQuote() elsewhere.
 */
export async function lookupQuote(symbol: string) {
  const sym = symbol.trim().toUpperCase();
  const res = await fetch(`ETFTracker/api/StockQuotes?symbols=${encodeURIComponent(sym)}`);
  if (!res.ok) throw new Error(`Quote lookup failed (${res.status})`);
  const json = await res.json();
  // Expecting a map like { quotes: { [SYM]: {...} } }
  return json?.quotes?.[sym] ?? null;
}

// ---- Internals -------------------------------------------------------------

async function safeJson(r: Response) {
  try {
    return await r.json();
  } catch {
    return null;
  }
}

function numOrNull(v: unknown): number | null {
  const n = typeof v === "string" ? Number(v) : (v as number);
  return Number.isFinite(n) ? n : null;
}

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v : null;
}
