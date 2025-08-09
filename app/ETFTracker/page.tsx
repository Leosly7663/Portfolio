"use client";

import { useState, useEffect } from "react";
import { supabase } from "../Lib/supabaseClient";
import Link from "next/link";
import { recomputeBundles, lookupQuote } from "../utils/apiClient/route"; // adjust path
import { createBundleApi } from "../utils/apiClient/route"; 


export default function BundlesPage() {
  // --- Create bundle state ---
  const [creating, setCreating] = useState(false);
  const [bundleName, setBundleName] = useState("");
  const [bundleType, setBundleType] = useState<"Live" | "Demo">("Live");

  type PendingAsset = {
    ticker: string;
    quantity: number;
    priceAtAdd: number | null;
    currency: string | null;
    inception: string; // ISO
  };
  const [pendingAssets, setPendingAssets] = useState<PendingAsset[]>([]);

  const [lookupTicker, setLookupTicker] = useState("");
  const [lookupResult, setLookupResult] = useState<{
    ticker: string;
    price: number | null;
    previousClose: number | null;
    currency: string | null;
  } | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // --- Existing bundles state ---
  const [liveBundles, setLiveBundles] = useState<any[]>([]);
  const [demoBundles, setDemoBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ------ Effects ------
  useEffect(() => {
    fetchBundles();
  }, []);

  useEffect(() => {
    // kick a recompute on first load, then refetch
    refreshPerformance();
  }, []);

  // ------ Helpers ------
  function nowIsoLocal() {
    return new Date().toISOString();
  }

  async function validateTicker(t: string) {
    const sym = (t || "").trim().toUpperCase();
    if (!sym) return;
    setLookupLoading(true);
    setFormError(null);
    try {
      const res = await fetch(`/utils/StockQuotes?symbols=${encodeURIComponent(sym)}`);
      const json = await res.json();
      const q = json?.quotes?.[sym];
      if (!q) {
        setLookupResult(null);
        setFormError(`Could not find symbol "${sym}". Use the full Yahoo symbol (e.g., RY.TO).`);
        return;
      }
      setLookupResult({
        ticker: sym,
        price: q.price ?? null,
        previousClose: q.previousClose ?? null,
        currency: q.currency ?? null,
      });
    } catch (e: any) {
      setLookupResult(null);
      setFormError(e?.message || "Lookup failed");
    } finally {
      setLookupLoading(false);
    }
  }

  function confirmLookupToList() {
    if (!lookupResult) return;
    const inception = bundleType === "Live" ? nowIsoLocal() : nowIsoLocal(); // editable later if Demo
    setPendingAssets((prev) => [
      ...prev,
      {
        ticker: lookupResult.ticker,
        quantity: 1,
        priceAtAdd: lookupResult.price ?? null,
        currency: lookupResult.currency ?? null,
        inception,
      },
    ]);
    setLookupTicker("");
    setLookupResult(null);
  }

  function removePending(ticker: string) {
    setPendingAssets((prev) => prev.filter((a) => a.ticker !== ticker));
  }

  function updatePending(ticker: string, patch: Partial<PendingAsset>) {
    setPendingAssets((prev) => prev.map((a) => (a.ticker === ticker ? { ...a, ...patch } : a)));
  }

  async function getOrCreateAssetId(ticker: string): Promise<number> {
    const { data: found, error: selErr } = await supabase
      .from("Soln0002 - Assets")
      .select("id")
      .eq("ticker", ticker)
      .maybeSingle();

    if (selErr) throw new Error(selErr.message);
    if (found?.id) return found.id;

    const { data: inserted, error: insErr } = await supabase
      .from("Soln0002 - Assets")
      .insert([{ ticker }])
      .select("id")
      .single();

    if (insErr) throw new Error(insErr.message);
    return inserted.id as number;
  }

  async function createBundle() {
  setCreateLoading(true);
  setFormError(null);
  try {
    if (!bundleName.trim()) throw new Error("Please enter a bundle name.");
    if (!pendingAssets.length) throw new Error("Add at least one asset.");

    const payload = {
      name: bundleName.trim(),
      type: bundleType,
      assets: pendingAssets.map((a) => ({
        ticker: a.ticker,
        quantity: a.quantity || 1,
        open_price: a.priceAtAdd ?? null,
        inception_date: bundleType === "Live" ? undefined : a.inception, // server will force now() for Live
      })),
    } as const;

    await createBundleApi(payload);

    // reset + refetch
    setCreating(false);
    setBundleName("");
    setBundleType("Live");
    setPendingAssets([]);
    await fetchBundles();
  } catch (e: any) {
    setFormError(e?.message || "Failed to create bundle");
  } finally {
    setCreateLoading(false);
  }
}

  async function fetchBundles() {
    setLoading(true);
    const { data, error } = await supabase
      .from("Soln0002 - Bundles")
      .select(`
        id,
        name,
        type,
        bundle_PL,
        assets:"Soln0002 - Assets to Bundles" (
          asset:"Soln0002 - Assets" (
            id,
            ticker
          )
        )
      `);

    if (error) {
      console.error(error);
      setLiveBundles([]);
      setDemoBundles([]);
    } else {
      const formatted = (data || []).map((bundle: any) => ({
        ...bundle,
        assets: bundle.assets?.map((a: any) => a.asset) || [],
      }));
      setLiveBundles(formatted.filter((b: any) => b.type === "Live"));
      setDemoBundles(formatted.filter((b: any) => b.type === "Demo"));
    }
    setLoading(false);
  }

  async function refreshPerformance() {
  try {
    setUpdating(true);
    await recomputeBundles();
    await fetchBundles();
  } finally {
    setUpdating(false);
  }
}

  function renderBundleCard(bundle: any) {
    const hasPL = typeof bundle.bundle_PL === "number";
    const color = hasPL ? (bundle.bundle_PL >= 0 ? "text-green-600" : "text-red-600") : "text-gray-500";

    return (
      <Link key={bundle.id} href={`/ETFTracker/${bundle.id}`}>
        <div className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition duration-200 border cursor-pointer">
          <h2 className="text-lg font-semibold mb-2">{bundle.name}</h2>
          <div className="flex space-x-2 mb-3">
            {bundle.assets.slice(0, 3).map((asset: any, id: number) => (
              <span
                key={id}
                className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md"
              >
                {asset?.ticker}
              </span>
            ))}
          </div>
          <p className={`font-bold ${color}`}>
            {hasPL ? (
              <>
                {bundle.bundle_PL >= 0 ? "+" : ""}
                {bundle.bundle_PL.toFixed(2)}%
              </>
            ) : (
              "—"
            )}
          </p>
        </div>
      </Link>
    );
  }

  if (loading) return <p className="text-gray-500">Loading bundles...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Create Bundle Panel */}
      <div className="mb-6 rounded-2xl border p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create New Bundle</h2>
          <div className="flex gap-2">
            <button
              onClick={refreshPerformance}
              disabled={updating}
              className={`px-3 py-1 rounded-lg text-white ${
                updating ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {updating ? "Updating…" : "Refresh performance"}
            </button>
            <button
              onClick={() => setCreating((s) => !s)}
              className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              {creating ? "Close" : "New Bundle"}
            </button>
          </div>
        </div>

        {creating && (
          <div className="mt-4 space-y-4">
            {formError && <div className="text-red-600 text-sm">{formError}</div>}

            {/* Name + Type */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={bundleName}
                onChange={(e) => setBundleName(e.target.value)}
                placeholder="Bundle name"
                className="w-full border rounded-lg px-3 py-2"
              />
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Type:</label>
                <select
                  value={bundleType}
                  onChange={(e) => {
                    const v = e.target.value as "Live" | "Demo";
                    setBundleType(v);
                    if (v === "Live") {
                      const nowIso = nowIsoLocal();
                      setPendingAssets((prev) => prev.map((p) => ({ ...p, inception: nowIso })));
                    }
                  }}
                  className="border rounded-lg px-2 py-2"
                >
                  <option value="Live">Live</option>
                  <option value="Demo">Demo</option>
                </select>
              </div>
            </div>

            {/* Add Asset */}
            <div className="rounded-lg border p-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={lookupTicker}
                  onChange={(e) => setLookupTicker(e.target.value)}
                  placeholder="Enter ticker (e.g., AAPL or RY.TO)"
                  className="flex-1 border rounded-lg px-3 py-2"
                />
                <button
                  onClick={() => validateTicker(lookupTicker)}
                  disabled={lookupLoading || !lookupTicker.trim()}
                  className={`px-3 py-2 rounded-lg text-white ${
                    lookupLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {lookupLoading ? "Looking up…" : "Lookup"}
                </button>
                <button
                  onClick={confirmLookupToList}
                  disabled={!lookupResult}
                  className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                >
                  + Add
                </button>
              </div>

              {/* Lookup preview */}
              <div className="mt-2 text-sm text-gray-700">
                {lookupResult ? (
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{lookupResult.ticker}</span>
                    <span>
                      Price:{" "}
                      {lookupResult.price != null ? lookupResult.price.toFixed(2) : "—"}{" "}
                      {lookupResult.currency || ""}
                    </span>
                    <span
                      className={`${
                        (lookupResult.price ?? 0) - (lookupResult.previousClose ?? 0) >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Δ{" "}
                      {lookupResult.previousClose != null && lookupResult.price != null
                        ? (lookupResult.price - lookupResult.previousClose).toFixed(2)
                        : "—"}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-500">Enter a ticker and click Lookup to validate.</span>
                )}
              </div>
            </div>

            {/* Pending assets */}
            <div className="overflow-x-auto rounded-xl border">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Ticker</th>
                    <th className="px-3 py-2 text-left">Quantity</th>
                    <th className="px-3 py-2 text-left">Open Price (at add)</th>
                    <th className="px-3 py-2 text-left">Currency</th>
                    <th className="px-3 py-2 text-left">
                      Inception {bundleType === "Live" ? "(now)" : ""}
                    </th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {pendingAssets.length ? (
                    pendingAssets.map((a) => (
                      <tr key={a.ticker} className="border-t">
                        <td className="px-3 py-2 font-semibold">{a.ticker}</td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={a.quantity}
                            onChange={(e) =>
                              updatePending(a.ticker, { quantity: Number(e.target.value || 0) })
                            }
                            className="w-24 border rounded-lg px-2 py-1"
                          />
                        </td>
                        <td className="px-3 py-2">
                          {a.priceAtAdd != null ? a.priceAtAdd.toFixed(2) : "—"}
                        </td>
                        <td className="px-3 py-2">{a.currency || "—"}</td>
                        <td className="px-3 py-2">
                          {bundleType === "Live" ? (
                            <input
                              type="datetime-local"
                              value={a.inception.slice(0, 16)}
                              disabled
                              className="border rounded-lg px-2 py-1 bg-gray-100 text-gray-500"
                            />
                          ) : (
                            <input
                              type="datetime-local"
                              value={a.inception.slice(0, 16)}
                              onChange={(e) =>
                                updatePending(a.ticker, {
                                  inception: new Date(e.target.value).toISOString(),
                                })
                              }
                              className="border rounded-lg px-2 py-1"
                            />
                          )}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            onClick={() => removePending(a.ticker)}
                            className="px-2 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-3 py-4 text-gray-500" colSpan={6}>
                        No assets added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Create */}
            <div className="flex justify-end">
              <button
                onClick={createBundle}
                disabled={createLoading || !bundleName.trim() || !pendingAssets.length}
                className={`mt-3 px-4 py-2 rounded-lg text-white ${
                  createLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {createLoading ? "Creating…" : "Create Bundle"}
              </button>
            </div>
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold mb-6">Hybrid ETF Tracker</h1>

      {/* Live */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Live ETFs</h2>
        {liveBundles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveBundles.map(renderBundleCard)}
          </div>
        ) : (
          <p className="text-gray-500">No live ETFs available.</p>
        )}
      </section>

      {/* Demo */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Demo ETFs</h2>
        {demoBundles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoBundles.map(renderBundleCard)}
          </div>
        ) : (
          <p className="text-gray-500">No demo ETFs available.</p>
        )}
      </section>
    </div>
  );
}
