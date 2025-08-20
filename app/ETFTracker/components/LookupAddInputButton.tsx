"use client";
import { useState, useCallback } from "react";

type LookupAddInputButtonProps = {
  onLookup: (symbol: string) => Promise<any>; // returns the lookup result object
  onAdd: (result: any) => Promise<void> | void;
  onResult?: (result: any | null) => void;    // 🔹 lets parent show a preview row
  placeholder?: string;
  initialSymbol?: string;
  className?: string;
};

export default function LookupAddInputButton({
  onLookup,
  onAdd,
  onResult,
  placeholder = "Enter symbol",
  initialSymbol = "",
  className = "",
}: LookupAddInputButtonProps) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [mode, setMode] = useState<"lookup" | "add">("lookup");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSymbol(v);
    setMode("lookup");
    setResult(null);
    setError(null);
    onResult?.(null);
  };

  const doLookup = useCallback(async () => {
    const s = symbol.trim();
    if (!s) return;
    setLoading(true);
    setError(null);
    try {
      const r = await onLookup(s);
      setResult(r);
      onResult?.(r);
      setMode("add");
    } catch (e: any) {
      setError(e?.message || "Lookup failed");
      setResult(null);
      onResult?.(null);
      setMode("lookup");
    } finally {
      setLoading(false);
    }
  }, [symbol, onLookup, onResult]);

  const doAdd = useCallback(async () => {
    if (!result) return;
    setLoading(true);
    setError(null);
    try {
      await onAdd(result);
      // reset after add
      setSymbol("");
      setResult(null);
      onResult?.(null);
      setMode("lookup");
    } catch (e: any) {
      setError(e?.message || "Add failed");
    } finally {
      setLoading(false);
    }
  }, [result, onAdd, onResult]);

  const handleClick = () => {
    if (mode === "lookup") doLookup();
    else doAdd();
  };

  const canLookup = !!symbol.trim() && !loading;
  const canAdd = !!result && !loading;

  const buttonText =
    mode === "lookup" ? (loading ? "Looking up…" : "Lookup") : "+ Add";

  const buttonClass =
    mode === "lookup"
      ? `px-3 py-2 rounded-lg text-white ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`
      : "px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white";

  return (
    <div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      <div className="flex-1">
        <input
          value={symbol}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (mode === "lookup" && canLookup) doLookup();
              if (mode === "add" && canAdd) doAdd();
            }
          }}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      <button
        onClick={handleClick}
        disabled={
          (mode === "lookup" && !canLookup) || (mode === "add" && !canAdd)
        }
        className={`${buttonClass} disabled:opacity-50`}
      >
        {buttonText}
      </button>
    </div>
  );
}
