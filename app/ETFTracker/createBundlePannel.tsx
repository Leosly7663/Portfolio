"use client";
import { useOrderPlacement } from "./useOrderPlacement";
import { FEE_FLAT, FEE_BPS } from "./components/orders/fees";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";
import { getQuote, type Quote } from "./api/apiClient/route";
import LookupAddInputButton from "./components/LookupAddInputButton";
import { supabase } from "../Lib/supabase/supabaseClient";

// If you already exported these from /modules/orders/types, import from there instead.
type OrderType = "Market" | "PostOnly";

type PendingAsset = {
  ticker: string;
  shares: number;
  priceAtAdd: number | null;
  currency: string | null;
  inception: string; // ISO
  ruleId?: number | null;
  limitPrice?: number | null;
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

  // ⬇️ Pull everything from the hook instead of local state
  const {
    state: {
      orderType,
      setOrderType,
      bundleType,
      setBundleType,
      pending,
      setPending,
      bundleName,
      setBundleName,
      accountBalance,
      totals: { notional, fees, total, totalShares },
      loading,
    },
    actions: { fetchBalance, createPending, confirm },
  } = useOrderPlacement();

  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const createInFlight = useRef(false);

  const [lookupResult, setLookupResult] = useState<Quote | null>(null);
  

  // Rules
  const [ruleOptions, setRuleOptions] = useState<RuleOption[]>([]);
  const [loadingRules, setLoadingRules] = useState(false);
  const [rulesError, setRulesError] = useState<string | null>(null);

  // Confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPayload, setConfirmPayload] = useState<any | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const [preparing, setPreparing] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);  

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
        ruleId: null,
        limitPrice: null,
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

  // Build warnings for the confirm modal (strike sanity)
  function buildWarnings() {
    const warnings: string[] = [];
    if (orderType === "PostOnly") {
      for (const a of pending) {
        const last = a.priceAtAdd ?? 0;
        const lim = a.limitPrice ?? 0;
        if (last > 0 && lim > 0) {
          const diff = Math.abs(lim - last) / last;
          if (diff > 0.2) {
            warnings.push(
              `${a.ticker}: strike ${lim.toFixed(2)} is ${(diff * 100).toFixed(
                1
              )}% away from last ${last.toFixed(2)}`
            );
          }
        }
      }
    }
    return warnings;
  }

  // Pre-submit: validate & open modal (balance from API)

  async function openConfirm() {
    try {
      setAttemptedSubmit(true);
      setFormError(null);
      setConfirmError(null);

      if (!bundleName.trim()) throw new Error("Please enter a bundle name.");
      if (!pending.length) throw new Error("Add at least one asset.");

      if (orderType === "PostOnly") {
        const missing = pending.filter((p) => !(p.limitPrice && p.limitPrice > 0));
        if (missing.length) {
          throw new Error(`Enter a strike price for: ${missing.map((m) => m.ticker).join(", ")}`);
        }
      }

      setPreparing(true);               // ⬅️ show “Preparing…”
      await fetchBalance(user!.id);

      setConfirmPayload({
        warnings: buildWarnings(),
        ui: { totalNotional: notional, estFees: fees, estTotal: total, accountBalance },
      });
      setShowConfirm(true);
    } catch (e: any) {
      setFormError(e?.message || "Failed to prepare confirmation");
    } finally {
      setPreparing(false);              // ⬅️ back to normal
    }
  }

  async function confirmAndCreate() {
    if (createInFlight.current) return;
    createInFlight.current = true;
    setConfirmError(null);
    try {
      const orderId = await createPending(user!.id); // builds payload in the hook
      const receipt = await confirm(orderId, user!.id);        // RPC confirm, returns receipt
      // reset UI
      setShowConfirm(false);
      setBundleName("");
      setPending([]);
      setOrderType("Market");
      setBundleType("Spot");
      await onRefresh();
      // toast receipt.receiptNumber if you want
    } catch (e: any) {
      setConfirmError(e.message || "Failed to place order");
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
                setConfirmError(null);
                setShowConfirm(false);
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

          {/* Name + Type + OrderType */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <input
              value={bundleName}
              onChange={(e) => setBundleName(e.target.value)}
              placeholder="Bundle name"
              className="w-full border rounded-lg px-3 py-2"
            />

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Bundle Type:</label>
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

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Order:</label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as OrderType)}
                className="border rounded-lg px-2 py-2"
              >
                <option value="Market">Market Buy</option>
                <option value="PostOnly">Post-Only (Limit)</option>
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
                      ? (lookupResult.price - lookupResult.previousClose).toFixed(2)
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

          {/* Allocation + Summary */}
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

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Estimated Notional
              </label>
              <div className="px-3 py-2 border rounded-lg bg-gray-50">
                {notional ? notional.toFixed(2) : "—"}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {orderType === "Market"
                  ? "Uses latest quote snapshot."
                  : "Uses your strike prices."}
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Fees & Total
              </label>
              <div className="px-3 py-2 border rounded-lg bg-gray-50">
                Fees: {fees.toFixed(2)} • Total:{" "}
                <strong>{total ? total.toFixed(2) : "—"}</strong>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Flat ${FEE_FLAT.toFixed(2)} + {FEE_BPS} bps of notional.
              </p>
            </div>
          </div>

          {/* Tables */}
          {bundleType === "Spot" ? (
            <PendingTableSpot
              pending={pending}
              totalShares={totalShares}
              orderType={orderType}
              onPercentEdit={handlePercentEdit}
              onSharesEdit={handleSharesEdit}
              onUpdate={update}
              onRemove={remove}
            />
          ) : (
            <PendingTableManaged
              pending={pending}
              totalShares={totalShares}
              orderType={orderType}
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
            onClick={openConfirm}
            disabled={preparing || loading || createInFlight.current} // ⬅️ removed name/pending guards
            className={`mt-3 px-4 py-2 rounded-lg text-white ${
              preparing || loading || createInFlight.current
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {preparing || loading || createInFlight.current ? "Preparing…" : "Review & Place Order"}
          </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && confirmPayload && (
        <OrderConfirmModal
          onClose={() => setShowConfirm(false)}
          onConfirm={confirmAndCreate}
          submitting={loading || createInFlight.current}
          payload={confirmPayload}
          error={confirmError}
        />
      )}
    </div>
  );
}

/* ------------------------ Spot Creator Table ------------------------ */
function PendingTableSpot({
  pending,
  totalShares,
  orderType,
  onPercentEdit,
  onSharesEdit,
  onUpdate,
  onRemove,
}: {
  pending: PendingAsset[];
  totalShares: number;
  orderType: OrderType;
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
            {orderType === "PostOnly" && (
              <th className="px-3 py-2 text-left">Strike Price</th>
            )}
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
              const effectivePrice =
                orderType === "PostOnly"
                  ? a.limitPrice ?? a.priceAtAdd ?? 0
                  : a.priceAtAdd ?? 0;
              const lineCost = effectivePrice * qty;

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
                        onChange={(e) => onPercentEdit(a.ticker, e.target.value)}
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

                  {orderType === "PostOnly" && (
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        step="0.0001"
                        min={0}
                        value={a.limitPrice ?? ""}
                        placeholder="Enter strike"
                        onChange={(e) =>
                          onUpdate(a.ticker, {
                            limitPrice:
                              e.target.value === "" ? null : Number(e.target.value),
                          })
                        }
                        className="w-28 border rounded-lg px-2 py-1"
                      />
                    </td>
                  )}

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
              <td
                className="px-3 py-4 text-gray-500"
                colSpan={orderType === "PostOnly" ? 9 : 8}
              >
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
  orderType,
  onPercentEdit,
  onSharesEdit,
  onUpdate,
  onRemove,
  rules,
  loadingRules,
}: {
  pending: PendingAsset[];
  totalShares: number;
  orderType: OrderType;
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
            {orderType === "PostOnly" && (
              <th className="px-3 py-2 text-left">Strike Price</th>
            )}
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
              const effectivePrice =
                orderType === "PostOnly"
                  ? a.limitPrice ?? a.priceAtAdd ?? 0
                  : a.priceAtAdd ?? 0;
              const pct = totalShares > 0 ? (qty / totalShares) * 100 : 0;
              const lineCost = effectivePrice * qty;

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
                        onChange={(e) => onPercentEdit(a.ticker, e.target.value)}
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

                  {orderType === "PostOnly" && (
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        step="0.0001"
                        min={0}
                        value={a.limitPrice ?? ""}
                        placeholder="Enter strike"
                        onChange={(e) =>
                          onUpdate(a.ticker, {
                            limitPrice:
                              e.target.value === "" ? null : Number(e.target.value),
                          })
                        }
                        className="w-28 border rounded-lg px-2 py-1"
                      />
                    </td>
                  )}

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
                          ruleId:
                            e.target.value === "" ? null : Number(e.target.value),
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
              <td
                className="px-3 py-4 text-gray-500"
                colSpan={orderType === "PostOnly" ? 10 : 9}
              >
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

/* ----------------------- Confirmation Modal ------------------------ */
function OrderConfirmModal({
  onClose,
  onConfirm,
  submitting,
  payload,
  error,
}: {
  onClose: () => void;
  onConfirm: () => void;
  submitting: boolean;
  payload: {
    warnings: string[];
    ui: {
      totalNotional: number;
      estFees: number;
      estTotal: number;
      accountBalance: number | null;
    };
  };
  error: string | null;
}) {
  const { warnings, ui } = payload;
  const insuff =
    ui.accountBalance != null ? ui.estTotal > ui.accountBalance + 1e-9 : false;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
      <div className="w-full sm:max-w-2xl bg-white rounded-2xl shadow-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-2">Confirm Order</h3>

        <div className="space-y-3">
          {warnings.length > 0 && (
            <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
              <div className="font-medium mb-1">Strike price warnings</div>
              <ul className="list-disc pl-5">
                {warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-md border p-3 text-sm">
            <div className="flex justify-between">
              <span>Estimated notional</span>
              <span>${ui.totalNotional.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated fees</span>
              <span>${ui.estFees.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${ui.estTotal.toFixed(2)}</span>
            </div>
            <div className="mt-2 border-t pt-2 flex justify-between text-gray-600">
              <span>Account balance</span>
              <span>
                {ui.accountBalance == null ? "—" : `$${ui.accountBalance.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Balance after</span>
              <span>
                {ui.accountBalance == null
                  ? "—"
                  : `$${(ui.accountBalance - ui.estTotal).toFixed(2)}`}
              </span>
            </div>
          </div>

          {ui.accountBalance == null && (
            <div className="text-red-600 text-sm">
              Could not read your account balance. You can still proceed, but we
              cannot validate funds.
            </div>
          )}

          {insuff && (
            <div className="text-red-600 text-sm">
              Insufficient balance to place this order.
            </div>
          )}

          {error && <div className="text-red-600 text-sm">{error}</div>}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting || insuff}
            className={`px-4 py-2 rounded-lg text-white ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Placing…" : "Confirm & Place"}
          </button>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          This confirmation will generate a receipt with fees and totals.
        </p>
      </div>
    </div>
  );
}
