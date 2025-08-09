"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../Lib/supabaseClient";
import { LockClosedIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

export default function BundleDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [bundle, setBundle] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"live" | "backtesting">("live");
  const [loading, setLoading] = useState(true);

  // quotes
  type Quote = { price: number | null; previousClose: number | null; currency: string | null };
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [quotesLoading, setQuotesLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchBundle();
  }, [id]);

  async function fetchBundle() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Soln0002 - Bundles")
      .select(`
        id,
        name,
        type,
        performance:bundle_PL,
        assets:"Soln0002 - Assets to Bundles" (
          open_price_USD,
          inception_date,
          shares,
          asset:"Soln0002 - Assets" (
            id,
            ticker
          )
        )
      `)
      .eq("id", Number(id))
      .single();

    if (error) {
      console.error(error);
      setBundle(null);
      setLoading(false);
      return;
    }

    const normalizedAssets = (data.assets || []).map((row: any) => ({
      id: row.asset.id,
      ticker: row.asset.ticker,
      name: row.asset.name,
      open_price_USD: row.open_price_USD ?? null,
      inception_date: row.inception_date ? new Date(row.inception_date) : null,
      shares: row.shares ?? 1,
    }));

    const b = { ...data, assets: normalizedAssets };
    setBundle(b);
    setLoading(false);

    // Fetch quotes after bundle loads
    if (normalizedAssets.length) {
      const symbols = normalizedAssets.map((a: any) => a.ticker?.toUpperCase()).filter(Boolean);
      await fetchQuotes(symbols); 
    }
  }

  async function fetchQuotes(symbols: string[]) {
    setQuotesLoading(true);
    try {
      const res = await fetch(`/utils/StockQuotes?symbols=${encodeURIComponent(symbols.join(","))}`);
      const json = await res.json();
      if (json?.quotes) setQuotes(json.quotes);
    } catch (e) {
      console.error(e);
    } finally {
      setQuotesLoading(false);
    }
  }
  

  const isDemo = bundle?.type === "Demo";
  
// Compute portfolio-level aggregates
  const totals = useMemo(() => {
    if (!bundle?.assets?.length) return null;

    let totalCost = 0;
    let totalMkt = 0;
    bundle.assets.forEach((a: any) => {
      const q = quotes[a.ticker];
      const last = q?.price ?? null;
      const qty = (a.shares ?? 1);
      const cost = (Number(a.open_price_USD ?? 0) || 0) * qty;
      const mkt = last ? last * qty : 0;

      totalCost += cost;
      totalMkt += mkt;
    });

    const pl = totalMkt - totalCost;
    const plPct = totalCost ? (pl / totalCost) * 100 : 0;
    return { totalCost, totalMkt, pl, plPct };
  }, [bundle?.assets, quotes]);

  if (loading) return <p className="text-gray-500">Loading bundle...</p>;
  if (!bundle) return <p className="text-gray-500">Bundle not found.</p>;
  

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mb-4 px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
      >
        ← Back
      </button>

      {/* Title and Type Badge */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold">{bundle.name}</h1>
        {isDemo ? (
          <span className="flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-md">
            <PencilSquareIcon className="w-4 h-4 mr-1" />
            Editable – Can Backtest
          </span>
        ) : (
          <span className="flex items-center px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-md">
            <LockClosedIcon className="w-4 h-4 mr-1" />
            Fixed Contents – Cannot Edit
          </span>
        )}
      </div>

      {/* Asset tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {bundle.assets.map((asset: any) => (
          <span key={asset.id} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md">
            {asset.ticker}
          </span>
        ))}
      </div>

      {/* Performance (bundle PL if you keep it) */}
      <p className={`font-bold mb-4 ${bundle.performance >= 0 ? "text-green-600" : "text-red-600"}`}>
        {bundle.performance >= 0 ? "+" : ""}
        {bundle.performance?.toFixed(2)}%
      </p>

      {/* Tabs */}
      <div className="flex space-x-4 border-b pb-2 mb-4">
        <button
          onClick={() => setActiveTab("live")}
          className={`pb-1 ${activeTab === "live" ? "border-b-2 border-blue-500 text-blue-600" : ""}`}
        >
          Live Performance
        </button>
        {isDemo && (
          <button
            onClick={() => setActiveTab("backtesting")}
            className={`pb-1 ${activeTab === "backtesting" ? "border-b-2 border-blue-500 text-blue-600" : ""}`}
          >
            Backtesting
          </button>
        )}
      </div>

      {/* LIVE TAB */}
      {activeTab === "live" && (
        <div className="space-y-4">
          {/* Quotes status + portfolio summary */}
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="text-sm text-gray-500">
              {quotesLoading ? "Updating quotes…" : "Quotes up to ~15s cache."}
            </div>
            {totals && (
              <div className="text-right">
                <div className="text-sm text-gray-500">Portfolio P/L (since inception)</div>
                <p className={`font-bold mb-4 ${bundle.performance >= 0 ? "text-green-600" : "text-red-600"}`}>
                {bundle.performance >= 0 ? "+" : ""}
                {bundle.performance?.toFixed(2)}%
              </p>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="px-4 py-2 font-medium text-gray-600">Ticker</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Qty</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Open Date</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Open Price</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Last</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Today Δ</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Today %Δ</th>
                  <th className="px-4 py-2 font-medium text-gray-600">All Time P/L</th>
                  <th className="px-4 py-2 font-medium text-gray-600">All TIme P/L %</th>
                </tr>
              </thead>
              <tbody>
                {bundle.assets.map((a: any) => {
                  const key = a.ticker?.toUpperCase?.() || "";
                  const q = quotes[key];                  // may be undefined

                  const last = typeof q?.price === "number" ? q!.price : null;
                  const prev = typeof q?.previousClose === "number" ? q!.previousClose : null;

                  const qty = Number(a.shares ?? 1);
                  const costPerShare = Number(a.open_price_USD ?? 0) || 0;

                  const dayChange = last != null && prev != null ? last - prev : null;
                  const dayPct = last != null && prev ? ((last - prev) / prev) * 100 : null;

                  const pl = last != null ? (last - costPerShare) * qty : null;
                  const plPct = last != null && costPerShare ? ((last - costPerShare) / costPerShare) * 100 : null;

                  return (
                    <tr key={a.id} className="border-t">
                      <td className="px-4 py-2 font-semibold">{a.ticker}</td>
                      <td className="px-4 py-2">{qty}</td>
                      <td className="px-4 py-2">
                      {a.inception_date
                        ? a.inception_date.toLocaleString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                      <td className="px-4 py-2">{costPerShare ? costPerShare.toFixed(2) : "-"}</td>
                      <td className="px-4 py-2">{last != null ? last.toFixed(2) : "—"}</td>
                      <td className={`px-4 py-2 ${dayChange != null ? (dayChange >= 0 ? "text-green-600" : "text-red-600") : ""}`}>
                        {dayChange != null ? ` ${dayChange >= 0 ? "+" : ""}${dayChange.toFixed(2)}` : "—"}
                      </td>
                      <td className={`px-4 py-2 ${dayPct != null ? (dayPct >= 0 ? "text-green-600" : "text-red-600") : ""}`}>
                        {dayPct != null ? `${dayPct >= 0 ? "+" : ""}${dayPct.toFixed(2)}%` : "—"}
                      </td>
                      <td className={`px-4 py-2 ${pl != null ? (pl >= 0 ? "text-green-600" : "text-red-600") : ""}`}>
                        {pl != null ? `${pl >= 0 ? "+" : ""}${pl.toFixed(2)}` : "—"}
                      </td>
                      <td className={`px-4 py-2 ${plPct != null ? (plPct >= 0 ? "text-green-600" : "text-red-600") : ""}`}>
                        {plPct != null ? `${plPct >= 0 ? "+" : ""}${plPct.toFixed(2)}%` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Greeks placeholder (for options) */}
          <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-600">
            <div className="font-semibold mb-1">Greeks</div>
            <p>
              Greeks (Δ, Γ, Θ, Vega, ρ) require option contract data (strike, expiry, implied volatility). 
              If you add options to your bundle schema, I can compute these with Black–Scholes and show per-leg and portfolio totals.
            </p>
          </div>
        </div>
      )}

      {/* BACKTESTING TAB */}
      {activeTab === "backtesting" && isDemo && (
        <div className="text-gray-600">
          Backtesting tools & bundle editing will go here.
          <button className="mt-4 px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
            Edit Bundle
          </button>
        </div>
      )}
    </div>
  );
}