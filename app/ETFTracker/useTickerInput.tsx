"use client";
import { useCallback, useState } from "react";
import { getQuote, type Quote } from "./api/apiClient/route";

export function useTickerLookup() {
  const [symbol, setSymbol] = useState("");
  const [result, setResult] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(async () => {
    const s = symbol.trim();
    if (!s) return;
    setLoading(true);
    setError(null);
    try {
      const r = await getQuote(s);
      setResult(r);
    } catch (e: any) {
      setError(e?.message || "Lookup failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  const reset = useCallback(() => {
    setSymbol("");
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return { symbol, setSymbol, result, loading, error, validate, reset };
}
