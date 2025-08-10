"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";
import { getQuote, type Quote } from "../api/apiClient/route";
import { createBundleApi } from "../api/apiClient/route";
import LookupAddInputButton from "./components/LookupAddInputButton";
// 🔹 adjust this import path to your project:
import { supabase } from "../Lib/supabaseClient";

type PendingAsset = {
  ticker: string;
  shares: number;
  priceAtAdd: number | null;
  currency: string | null;
  inception: string; // ISO
  ruleId?: number | null; // 🔹 NEW: selected managed rule (optional for Spot)
};

type RuleOption = { id: number; name: string };

export function CreateBundlePanel({
  onRefresh,
  refreshing,
}: {
  onRefresh: () => Promise<void>;
  refreshing: boolean;
}) {
  const router = useRouter();

  const { user } = useAuth();

  const [creating, setCreating] = useState(false);
  const [bundleName, setBundleName] = useState("");
  const [bundleType, setBundleType] = useState<"Spot" | "Managed">("Spot");
  const [pending, setPending] = useState<PendingAsset[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const createInFlight = useRef(false);

  const [lookupResult, setLookupResult] = useState<Quote | null>(null);

  // 🔹 Managed rules options fetched from Supabase
  const [ruleOptions, setRuleOptions] = useState<RuleOption[]>([]);
  const [loadingRules, setLoadingRules] = useState(false);
  const [rulesError, setRulesError] = useState<string | null>(null);

  // Fetch rules when panel is open AND type is Managed
  useEffect(() => {
    let cancelled = false;
    async function fetchRules() {
      if (!creating || bundleType !== "Managed") return;
      setLoadingRules(true);
      setRulesError(null);
      try {
        const { data, error } = await supabase
          .from("Soln0002 - Rules")
          .select("id, name")
          .order("name", { ascending: true });

        if (error) throw error;
        if (!cancelled) setRuleOptions((data || []) as RuleOption[]);
      } catch (e: any) {
        if (!cancelled) {
          setRulesError(e?.message || "Failed to load rules");
          setRuleOptions([]);
        }
      } finally {
        if (!cancelled) setLoadingRules(false);
      }
    }
    fetchRules();
    return () => {
      cancelled = true;
    };
  }, [creating, bundleType]);

  const totalShares = useMemo(
    () => pending.reduce((s, a) => s + (Number(a.shares) || 0), 0),
    [pending]
  );
  const totalCost = useMemo(
    () =>
      pending.reduce(
        (s, a) => s + (Number(a.priceAtAdd) || 0) * (Number(a.shares) || 0),
        0
      ),
    [pending]
  );

  const nowIsoLocal = () => new Date().toISOString();

  function addFromLookup(result: Quote) {
    if (!result) return;
    const inception = nowIsoLocal();
    setPending((prev) => [
      ...prev,
      {
        ticker: result.ticker,
        shares: 1,
        priceAtAdd: result.price ?? null,
        currency: result.currency ?? null,
        inception,
        ruleId: null, // 🔹 none selected yet
      },
    ]);
    setLookupResult(null);
  }

  function remove(ticker: string) {
    setPending((prev) => prev.filter((a) => a.ticker !== ticker));
  }

  function update(ticker: string, patch: Partial<PendingAsset>) {
    setPending((prev) =>
      prev.map((a) => (a.ticker === ticker ? { ...a, ...patch } : a))
    );
  }

  // Allocation helpers
  function handleTotalSharesChange(raw: string) {
    const newTotal = Number(raw);
    if (!isFinite(newTotal) || newTotal <= 0) return;
    const oldTotal = totalShares;
    if (oldTotal <= 0) {
      const even = newTotal / Math.max(pending.length, 1);
      setPending((prev) => prev.map((a) => ({ ...a, shares: even })));
      return;
    }
    const factor = newTotal / oldTotal;
    setPending((prev) =>
      prev.map((a) => ({ ...a, shares: (Number(a.shares) || 0) * factor }))
    );
  }

  function handlePercentEdit(tkr: string, raw: string) {
    const pct = Number(raw);
    if (!isFinite(pct) || pct < 0) return;
    setPending((prev) =>
      prev.map((a) =>
        a.ticker === tkr
          ? { ...a, shares: (pct / 100) * Math.max(totalShares, 0) }
          : a
      )
    );
  }

  function handleSharesEdit(tkr: string, raw: string) {
    const qty = Number(raw);
    if (!isFinite(qty) || qty < 0) return;
    setPending((prev) =>
      prev.map((a) => (a.ticker === tkr ? { ...a, shares: qty } : a))
    );
  }

  
  async function createBundle() {
    if (createInFlight.current) return;
    createInFlight.current = true;

    try {
      if (!bundleName.trim()) throw new Error("Please enter a bundle name.");
      if (!pending.length) throw new Error("Add at least one asset.");
    
      const payload = {
        name: bundleName.trim(),
        user_id: user!.id,
        type: bundleType,
        assets: pending.map((a) => ({
          ticker: a.ticker,
          shares: a.shares || 1,
          open_price_USD: a.priceAtAdd ?? null,
          inception_date: bundleType === "Spot" ? undefined : a.inception,
          // 🔹 include rule_id only for Managed; undefined is dropped by JSON.stringify
          rule_id: bundleType === "Managed" ? a.ruleId ?? null : undefined,
        })),
      } as const;

      await createBundleApi(payload);

      // reset UI
      setCreating(false);
      setBundleName("");
      setBundleType("Spot");
      setPending([]);
      setLookupResult(null);
      await onRefresh();
    } catch (e: any) {
      setFormError(e?.message || "Failed to create bundle");
    } finally {
      createInFlight.current = false;
    }
  }

  return (
    <div className="mb-6 rounded-2xl border p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Create New Bundle</h2>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className={`px-3 py-1 rounded-lg text-white ${
              refreshing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {refreshing ? "Updating…" : "Refresh performance"}
          </button>
          <button
            onClick={() => {
              if (creating) {
                setPending([]);
                setLookupResult(null);
                setFormError(null);
              }
              setCreating((s) => !s);
            }}
            className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            {creating ? "Close" : "New Bundle"}
          </button>
        </div>
      </div>

      {creating && (
        <div className="mt-4 space-y-4">
          {(formError || rulesError) && (
            <div className="text-red-600 text-sm">
              {formError || rulesError}
            </div>
          )}

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
                  const v = e.target.value as "Spot" | "Managed";
                  setBundleType(v);
                  if (v === "Spot") {
                    const nowIso = nowIsoLocal();
                    setPending((prev) =>
                      prev.map((p) => ({ ...p, inception: nowIso }))
                    );
                  }
                }}
                className="border rounded-lg px-2 py-2"
              >
                <option value="Spot">Spot</option>
                <option value="Managed">Managed</option>
              </select>
            </div>
          </div>

          {/* Add Asset */}
          <div className="rounded-lg border p-3">
            <LookupAddInputButton
              onLookup={getQuote}
              onAdd={(quote) => addFromLookup(quote)}
              onResult={setLookupResult}
              placeholder="Enter ticker (e.g., AAPL or RY.TO)"
            />

            <div className="mt-2 text-sm text-gray-700">
              {lookupResult ? (
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="font-semibold">{lookupResult.ticker}</span>
                  <span>
                    Price:{" "}
                    {lookupResult.price != null
                      ? Number(lookupResult.price).toFixed(2)
                      : "—"}{" "}
                    {lookupResult.currency || ""}
                  </span>
                  <span
                    className={`${
                      (lookupResult.price ?? 0) -
                        (lookupResult.previousClose ?? 0) >=
                      0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Δ{" "}
                    {lookupResult.previousClose != null &&
                    lookupResult.price != null
                      ? (
                          lookupResult.price - lookupResult.previousClose
                        ).toFixed(2)
                      : "—"}
                  </span>
                </div>
              ) : (
                <span className="text-gray-500">
                  Enter a ticker and click Lookup to validate.
                </span>
              )}
            </div>
          </div>

          {/* Allocation summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Total Shares (cumulative)
              </label>
              <input
                type="number"
                step="0.0001"
                min={0}
                value={totalShares}
                onChange={(e) => handleTotalSharesChange(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Editing this scales each asset’s shares proportionally (keeps
                current %).
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">
                Estimated Purchase Cost
              </label>
              <div className="px-3 py-2 border rounded-lg bg-gray-50">
                {totalCost ? totalCost.toFixed(2) : "—"}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Uses current quote as open price. You can override later if
                needed.
              </p>
            </div>
          </div>

          {/* Spot vs Managed */}
          {bundleType === "Spot" ? (
            <PendingTableSpot
              pending={pending}
              totalShares={totalShares}
              onPercentEdit={handlePercentEdit}
              onSharesEdit={handleSharesEdit}
              onUpdate={update}
              onRemove={remove}
            />
          ) : (
            <PendingTableManaged
              pending={pending}
              totalShares={totalShares}
              onPercentEdit={handlePercentEdit}
              onSharesEdit={handleSharesEdit}
              onUpdate={update}
              onRemove={remove}
              rules={ruleOptions}
              loadingRules={loadingRules}
            />
          )}

          {/* Create */}
          <div className="flex justify-end">
            <button
              onClick={createBundle}
              disabled={
                !bundleName.trim() ||
                !pending.length ||
                createInFlight.current
              }
              className={`mt-3 px-4 py-2 rounded-lg text-white ${
                createInFlight.current
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {createInFlight.current ? "Creating..." : "Create Bundle"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------ Spot Creator Table ------------------------ */
function PendingTableSpot({
  pending,
  totalShares,
  onPercentEdit,
  onSharesEdit,
  onUpdate,
  onRemove,
}: {
  pending: PendingAsset[];
  totalShares: number;
  onPercentEdit: (ticker: string, raw: string) => void;
  onSharesEdit: (ticker: string, raw: string) => void;
  onUpdate: (ticker: string, patch: Partial<PendingAsset>) => void;
  onRemove: (ticker: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left">Ticker</th>
            <th className="px-3 py-2 text-left">% Share</th>
            <th className="px-3 py-2 text-left">Shares</th>
            <th className="px-3 py-2 text-left">Price</th>
            <th className="px-3 py-2 text-left">Currency</th>
            <th className="px-3 py-2 text-left">Line Cost</th>
            <th className="px-3 py-2 text-left">Inception (now)</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {pending.length ? (
            pending.map((a) => {
              const qty = Number(a.shares) || 0;
              const pct = totalShares > 0 ? (qty / totalShares) * 100 : 0;
              const lineCost =
                (a.priceAtAdd != null ? Number(a.priceAtAdd) : 0) * qty;
              return (
                <tr key={a.ticker} className="border-t">
                  <td className="px-3 py-2 font-semibold">{a.ticker}</td>

                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.0001"
                        min={0}
                        value={Number.isFinite(pct) ? pct.toFixed(4) : "0"}
                        onChange={(e) =>
                          onPercentEdit(a.ticker, e.target.value)
                        }
                        className="w-28 border rounded-lg px-2 py-1"
                      />
                      <span className="text-gray-500 text-xs">%</span>
                    </div>
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="number"
                      step="0.0001"
                      min={0}
                      value={qty}
                      onChange={(e) => onSharesEdit(a.ticker, e.target.value)}
                      className="w-28 border rounded-lg px-2 py-1"
                    />
                  </td>

                  <td className="px-3 py-2">
                    {a.priceAtAdd != null ? a.priceAtAdd.toFixed(2) : "—"}
                  </td>
                  <td className="px-3 py-2">{a.currency || "—"}</td>
                  <td className="px-3 py-2">
                    {lineCost ? lineCost.toFixed(2) : "—"}
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="datetime-local"
                      value={a.inception.slice(0, 16)}
                      disabled
                      className="border rounded-lg px-2 py-1 bg-gray-100 text-gray-500"
                    />
                  </td>

                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => onRemove(a.ticker)}
                      className="px-2 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td className="px-3 py-4 text-gray-500" colSpan={8}>
                No assets added yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------------- Managed Creator Table ---------------------- */
function PendingTableManaged({
  pending,
  totalShares,
  onPercentEdit,
  onSharesEdit,
  onUpdate,
  onRemove,
  rules,
  loadingRules,
}: {
  pending: PendingAsset[];
  totalShares: number;
  onPercentEdit: (ticker: string, raw: string) => void;
  onSharesEdit: (ticker: string, raw: string) => void;
  onUpdate: (ticker: string, patch: Partial<PendingAsset>) => void;
  onRemove: (ticker: string) => void;
  rules: RuleOption[];
  loadingRules: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left">Ticker</th>
            <th className="px-3 py-2 text-left">% Share</th>
            <th className="px-3 py-2 text-left">Shares</th>
            <th className="px-3 py-2 text-left">Price</th>
            <th className="px-3 py-2 text-left">Currency</th>
            <th className="px-3 py-2 text-left">Line Cost</th>
            <th className="px-3 py-2 text-left">Inception</th>
            <th className="px-3 py-2 text-left">Rule</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {pending.length ? (
            pending.map((a) => {
              const qty = Number(a.shares) || 0;
              const pct = totalShares > 0 ? (qty / totalShares) * 100 : 0;
              const lineCost =
                (a.priceAtAdd != null ? Number(a.priceAtAdd) : 0) * qty;

              return (
                <tr key={a.ticker} className="border-t">
                  <td className="px-3 py-2 font-semibold">{a.ticker}</td>

                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.0001"
                        min={0}
                        value={Number.isFinite(pct) ? pct.toFixed(4) : "0"}
                        onChange={(e) =>
                          onPercentEdit(a.ticker, e.target.value)
                        }
                        className="w-28 border rounded-lg px-2 py-1"
                      />
                      <span className="text-gray-500 text-xs">%</span>
                    </div>
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="number"
                      step="0.0001"
                      min={0}
                      value={qty}
                      onChange={(e) => onSharesEdit(a.ticker, e.target.value)}
                      className="w-28 border rounded-lg px-2 py-1"
                    />
                  </td>

                  <td className="px-3 py-2">
                    {a.priceAtAdd != null ? a.priceAtAdd.toFixed(2) : "—"}
                  </td>
                  <td className="px-3 py-2">{a.currency || "—"}</td>
                  <td className="px-3 py-2">
                    {lineCost ? lineCost.toFixed(2) : "—"}
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="datetime-local"
                      value={a.inception.slice(0, 16)}
                      onChange={(e) =>
                        onUpdate(a.ticker, {
                          inception: new Date(e.target.value).toISOString(),
                        })
                      }
                      className="border rounded-lg px-2 py-1"
                    />
                  </td>

                  <td className="px-3 py-2">
                    <select
                      value={a.ruleId ?? ""}
                      onChange={(e) =>
                        onUpdate(a.ticker, {
                          ruleId: e.target.value === "" ? null : Number(e.target.value),
                        })
                      }
                      disabled={loadingRules}
                      className="min-w-52 border rounded-lg px-2 py-2 bg-white"
                    >
                      <option value="">
                        {loadingRules ? "Loading rules…" : "— No rules —"}
                      </option>
                      {rules.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </td>


                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => onRemove(a.ticker)}
                      className="px-2 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td className="px-3 py-4 text-gray-500" colSpan={9}>
                No assets added yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <p className="text-xs text-gray-500 p-3">
        Rules list is sourced from <em>Soln0002 - Rules</em>. Create or edit rules there.
      </p>
    </div>
  );
}
