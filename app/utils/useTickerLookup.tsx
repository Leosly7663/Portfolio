import { useCallback, useMemo, useRef, useState, useEffect } from "react";

type Lookup = { ticker: string; price: number | null; previousClose: number | null; currency: string | null; };

export function useTickerLookup() {
  const [symbol, setSymbol] = useState("");
  const [result, setResult] = useState<Lookup | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sym = useMemo(() => (symbol || "").trim().toUpperCase(), [symbol]);

  // 🔹 Auto-clear preview + error when the input is blank
  useEffect(() => {
    if (!sym) {
      setResult(null);
      setError(null);
    }
  }, [sym]);

  const validate = useCallback(async () => {
    if (!sym) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/utils/StockQuotes?symbols=${encodeURIComponent(sym)}`);
      const json = await res.json();
      const q = json?.quotes?.[sym];
      if (!q) {
        setResult(null);
        setError(`Could not find symbol "${sym}". Use full Yahoo symbol (e.g., RY.TO).`);
        return;
      }
      setResult({
        ticker: sym,
        price: q.price ?? null,
        previousClose: q.previousClose ?? null,
        currency: q.currency ?? null,
      });
    } catch (e: any) {
      setResult(null);
      setError(e?.message || "Lookup failed");
    } finally {
      setLoading(false);
    }
  }, [sym]);

  // 🔹 Handy helper for callers to force a full reset
  const reset = useCallback(() => {
    setSymbol("");
    setResult(null);
    setError(null);
  }, []);

  return { symbol, setSymbol, result, loading, error, validate, reset };
}
