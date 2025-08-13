"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../Lib/supabase/supabaseClient";
import { LockClosedIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

/* ======================== Types ======================== */
type Quote = { price: number | null; previousClose: number | null; currency: string | null };
type RuleOption = { id: number; name: string };
type AssetRow = {
  assetId: number;
  linkId: number;           // "Assets to Bundles".id
  ruleId: number | null;
  ticker: string;
  open_price_usd: number | null;
  inception_date: Date | null;
  shares: number;
  limit_price?: number | null;   // 👈 derived from Order Items
};

export default function BundleDetailsPage() {
  const { id } = useParams();
  const router = useRouter();


  const [bundle, setBundle] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"Spot" | "Managed" | "Rules">("Spot");
  const [loading, setLoading] = useState(true);

  // quotes
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [quotesLoading, setQuotesLoading] = useState(false);

  // managed rules
  const [ruleOptions, setRuleOptions] = useState<RuleOption[]>([]);
  const [rulesLoading, setRulesLoading] = useState(false);
  const [rulesError, setRulesError] = useState<string | null>(null);

  // rules tab: which asset link to edit
  const [selectedLinkId, setSelectedLinkId] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchBundle();
  }, [id]);
  
  async function fetchLatestLimitPrices(linkIds: number[]) {
    if (!linkIds.length) return {} as Record<number, number>;

    const { data, error } = await supabase
      .from('Soln0002 - Order Items')
      .select(`
        asset_bundle_link_id,
        limit_price,
        created_at,
        order:"Soln0002 - Orders"(order_type)
      `)
      .in('asset_bundle_link_id', linkIds)
      .not('limit_price', 'is', null)
      .order('created_at', { ascending: false }); // if you lack created_at, change to .order('id', { ascending:false })

    if (error || !data) {
      console.error('fetchLatestLimitPrices:', error);
      return {} as Record<number, number>;
    }

    // first row per linkId (because of DESC order) and only for non-Market orders
    const byLink: Record<number, number> = {};
    for (const row of data as any[]) {
      const linkId = Number(row.asset_bundle_link_id);
      const isLimit = row?.order?.order_type && row.order.order_type !== 'Market';
      if (!isLimit) continue;
      if (byLink[linkId] == null) {
        byLink[linkId] = Number(row.limit_price);
      }
    }
    return byLink;
  }

  async function fetchBundle() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Soln0002 - Bundles")
      .select(`
        id,
        name,
        bundle_type,
        performance:bundle_pl,
        assets:"Soln0002 - Assets to Bundles" (
          id,
          rule_id,
          open_price_usd,
          inception_date,
          shares,
          asset:"Soln0002 - Assets" ( id, ticker )
        )
      `)
      .eq("id", Number(id))
      .maybeSingle();

    if (error || !data) {
      console.error(error);
      setBundle(null);
      setLoading(false);
      return;
    }

    const normalizedAssets: AssetRow[] = (data.assets || []).map((row: any) => ({
      assetId: row.asset.id,
      linkId: row.id,
      ruleId: row.rule_id ?? null,
      ticker: row.asset.ticker,
      open_price_usd: row.open_price_usd ?? null,
      inception_date: row.inception_date ? new Date(row.inception_date) : null,
      shares: row.shares ?? 1,
    }));

    // 👇 fetch limit prices by link id (from Order Items)
    const linkIds = normalizedAssets.map((a) => a.linkId);
    const strikes = await fetchLatestLimitPrices(linkIds);

    // merge strikes into assets
    const assetsWithStrike = normalizedAssets.map((a) => ({
      ...a,
      limit_price: strikes[a.linkId] ?? null,
    }));

    const b = { ...data, assets: assetsWithStrike };
    setBundle(b);
    setLoading(false);

    // quotes
    if (assetsWithStrike.length) {
      const symbols = assetsWithStrike.map((a) => a.ticker?.toUpperCase()).filter(Boolean);
      await fetchQuotes(symbols);
    }

    // rules
    if (data.bundle_type === "Managed" && assetsWithStrike.length) {
      await fetchRuleOptions();
      setSelectedLinkId(assetsWithStrike[0].linkId);
    }
  }

  async function fetchQuotes(symbols: string[]) {
    if (!symbols.length) return;
    setQuotesLoading(true);
    try {
      // If your endpoint is /api/StockQuotes, update here:
      const res = await fetch(`/ETFTracker/api/StockQuotes?symbols=${encodeURIComponent(symbols.join(","))}`);
      const json = await res.json();
      if (json?.quotes) setQuotes(json.quotes);
    } catch (e) {
      console.error(e);
    } finally {
      setQuotesLoading(false);
    }
  }
  async function fetchRuleOptions() {
    setRulesLoading(true);
    setRulesError(null);
    try {
      const { data, error } = await supabase
        .from("Soln0002 - Rules")
        .select("id, name")
        .order("id", { ascending: true }); // order by id if many null names
      if (error) throw error;
      setRuleOptions((data || []).map((r: any) => ({
        id: r.id,
        name: r.name ?? `Rule #${r.id}`,
      })));
    } catch (e: any) {
      setRulesError(e?.message || "Failed to load rules");
      setRuleOptions([]);
    } finally {
      setRulesLoading(false);
    }
  }


async function createAndAttachRuleForSelected() {
  if (!selectedLinkId || !bundle) return;

  const selected = bundle.assets.find((a: AssetRow) => a.linkId === selectedLinkId);
  if (!selected) return;

  // 1) Create rule with defaults (no name)
  const { data: newRule, error: createErr } = await supabase
    .from("Soln0002 - Rules")
    .insert([{
      active: true,
      target_pct: null,
      rebalance: { mode: "off", thresholdPct: null, cadence: "off" },
      risk: { stopLossPct: null, takeProfitPct: null, trailing: false },
      dca: { enabled: false, every: "week", quantity: null, dayOfWeek: 1, dayOfMonth: 1 },
      notes: null,
    }])
    .select("id, name")
    .single();

  if (createErr || !newRule) {
    alert(createErr?.message || "Failed to create rule");
    return;
  }

  // 2) Attach to the selected asset link
  const { error: attachErr } = await supabase
    .from("Soln0002 - Assets to Bundles")
    .update({ rule_id: newRule.id })
    .eq("id", selectedLinkId);

  if (attachErr) {
    alert(attachErr.message);
    return;
  }

  // 3) Update local state + options
  setBundle((prev: any) => {
    if (!prev) return prev;
    const updated = prev.assets.map((a: AssetRow) =>
      a.linkId === selectedLinkId ? { ...a, ruleId: newRule.id } : a
    );
    return { ...prev, assets: updated };
  });

  // Add to dropdown options with a fallback label
  setRuleOptions((opts) => [
    ...opts,
    { id: newRule.id, name: newRule.name ?? `Rule #${newRule.id}` },
  ]);
}


  const isManaged = bundle?.bundle_type === "Managed";

  // Compute portfolio-level aggregates
  const totals = useMemo(() => {
    if (!bundle?.assets?.length) return null;
    let totalCost = 0;
    let totalMkt = 0;
    bundle.assets.forEach((a: AssetRow) => {
      const q = quotes[a.ticker?.toUpperCase?.()];
      const last = q?.price ?? null;
      const qty = a.shares ?? 1;
      const cost = (Number(a.open_price_usd ?? 0) || 0) * qty;
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
        {isManaged ? (
          <span className="flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-md">
            <PencilSquareIcon className="w-4 h-4 mr-1" />
            Managed – Can Backtest & Edit Rules
          </span>
        ) : (
          <span className="flex items-center px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-md">
            <LockClosedIcon className="w-4 h-4 mr-1" />
            Spot – Fixed Contents
          </span>
        )}
      </div>

      {/* Asset tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {bundle.assets.map((a: AssetRow) => (
          <span key={a.assetId} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md">
            {a.ticker}
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
          onClick={() => setActiveTab("Spot")}
          className={`pb-1 ${activeTab === "Spot" ? "border-b-2 border-blue-500 text-blue-600" : ""}`}
        >
          Spot Performance
        </button>

        {isManaged && (
          <>
            <button
              onClick={() => setActiveTab("Managed")}
              className={`pb-1 ${activeTab === "Managed" ? "border-b-2 border-blue-500 text-blue-600" : ""}`}
            >
              Managed Performance
            </button>
            <button
              onClick={() => setActiveTab("Rules")}
              className={`pb-1 ${activeTab === "Rules" ? "border-b-2 border-blue-500 text-blue-600" : ""}`}
            >
              Rules
            </button>
          </>
        )}
      </div>

      {/* Spot TAB */}
      {activeTab === "Spot" && (
        <SpotTable bundle={bundle} quotes={quotes} quotesLoading={quotesLoading} totals={totals} />
      )}

      {/* Managed Performance TAB */}
      {activeTab === "Managed" && isManaged && (
        <ManagedTable
          bundle={bundle}
          quotes={quotes}
          quotesLoading={quotesLoading}
          totals={totals}
          ruleOptions={ruleOptions}
          rulesLoading={rulesLoading}
          rulesError={rulesError}
          onChangeRule={async (linkId, ruleId) => {
            // update link row
            const { error } = await supabase
              .from("Soln0002 - Assets to Bundles")
              .update({ rule_id: ruleId })
              .eq("id", linkId);
            if (error) {
              alert(error.message);
              return;
            }
            // update local state
            setBundle((prev: any) => {
              if (!prev) return prev;
              const updated = prev.assets.map((a: AssetRow) =>
                a.linkId === linkId ? { ...a, ruleId } : a
              );
              return { ...prev, assets: updated };
            });
          }}
        />
      )}

      {/* Rules TAB */}
      {activeTab === "Rules" && isManaged && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Select asset:</label>
            <select
              value={selectedLinkId ?? ""}
              onChange={(e) => setSelectedLinkId(e.target.value ? Number(e.target.value) : null)}
              className="border rounded-lg px-2 py-2"
            >
              {bundle.assets.map((a: AssetRow) => (
                <option key={a.linkId} value={a.linkId}>
                  {a.ticker}
                </option>
              ))}
            </select>
          </div>

          {selectedLinkId ? (
            (() => {
              const selected = bundle.assets.find((a: AssetRow) => a.linkId === selectedLinkId);
              return (
                <ManagedRulesEditorInline
                  ruleId={selected?.ruleId ?? null}           // ← editor opens on the new rule once created
                  ticker={selected?.ticker ?? ""}
                  bundleName={bundle.name}
                  onCreateNew={createAndAttachRuleForSelected} // ← also allow creation inside the editor
                />
              );
            })()
          ) : (
            <div className="text-gray-500 text-sm">Choose an asset to edit its rules.</div>
          )}
        </div>
      )}

    </div>
  );
}

/* ---------------------- Spot Table ---------------------- */
function SpotTable({
  bundle,
  quotes,
  quotesLoading,
  totals,
}: {
  bundle: any;
  quotes: Record<string, Quote>;
  quotesLoading: boolean;
  totals: { totalCost: number; totalMkt: number; pl: number; plPct: number } | null;
}) {
  const hasStrike = Array.isArray(bundle.assets)
    ? bundle.assets.some((a: AssetRow) => a?.limit_price != null)
    : false
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="text-sm text-gray-500">
          {quotesLoading ? "Updating quotes…" : "Quotes up to ~15s cache."}
        </div>
        {totals && (
          <div className="text-right">
            <div className="text-sm text-gray-500">Portfolio P/L (since inception)</div>
            <p
              className={`font-bold mb-4 ${bundle.performance >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {bundle.performance >= 0 ? "+" : ""}
              {bundle.performance?.toFixed(2)}%
            </p>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm">
           <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-4 py-2 font-medium text-gray-600">Ticker</th>
                <th className="px-4 py-2 font-medium text-gray-600">Qty</th>
                <th className="px-4 py-2 font-medium text-gray-600">Order Date</th>
                <th className="px-4 py-2 font-medium text-gray-600">Open Price</th>
                {hasStrike && <th className="px-4 py-2 font-medium text-gray-600">Strike</th>}
                <th className="px-4 py-2 font-medium text-gray-600">Last</th>
                <th className="px-4 py-2 font-medium text-gray-600">Today Δ</th>
                <th className="px-4 py-2 font-medium text-gray-600">Today %Δ</th>
                <th className="px-4 py-2 font-medium text-gray-600">All Time P/L</th>
                <th className="px-4 py-2 font-medium text-gray-600">All Time P/L %</th>
              </tr>
            </thead>
          <tbody>
            {bundle.assets.map((a: AssetRow) => {
              const key = a.ticker?.toUpperCase?.() || "";
              const q = quotes[key];
              const last = typeof q?.price === "number" ? q!.price : null;
              const prev = typeof q?.previousClose === "number" ? q!.previousClose : null;
              const qty = Number(a.shares ?? 1);
              const costPerShare = Number(a.open_price_usd ?? 0) || 0;
              const strike = a.limit_price != null ? Number(a.limit_price) : null;
              const dayChange = last != null && prev != null ? last - prev : null;
              const dayPct = last != null && prev ? ((last - prev) / prev) * 100 : null;
              const pl = last != null ? (last - costPerShare) * qty : null;
              const plPct = last != null && costPerShare ? ((last - costPerShare) / costPerShare) * 100 : null;

              return (
                <tr key={a.linkId} className="border-t">
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
                  {hasStrike && (
                    <td className="px-4 py-2">{strike != null ? strike.toFixed(2) : "—"}</td>
                  )}
                  <td className="px-4 py-2">{last != null ? last.toFixed(2) : "—"}</td>
                  <td className={`px-4 py-2 ${dayChange != null ? (dayChange >= 0 ? "text-green-600" : "text-red-600") : ""}`}>
                    {dayChange != null ? `${dayChange >= 0 ? "+" : ""}${dayChange.toFixed(2)}` : "—"}
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

      {/* Greeks placeholder */}
      <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-600">
        <div className="font-semibold mb-1">Greeks</div>
        <p>
          Greeks (Δ, Γ, Θ, Vega, ρ) require option contract data. If you add options to your bundle schema,
          we can compute these with Black–Scholes and show per-leg and portfolio totals.
        </p>
      </div>
    </div>
  );
}

/* ------------------ Managed Performance Table ------------------ */
function ManagedTable({
  bundle,
  quotes,
  quotesLoading,
  totals,
  ruleOptions,
  rulesLoading,
  rulesError,
  onChangeRule,
}: {
  bundle: any;
  quotes: Record<string, Quote>;
  quotesLoading: boolean;
  totals: { totalCost: number; totalMkt: number; pl: number; plPct: number } | null;
  ruleOptions: RuleOption[];
  rulesLoading: boolean;
  rulesError: string | null;
  onChangeRule: (linkId: number, ruleId: number | null) => Promise<void>;
}) 
{
  const router = useRouter();
  const { id } = useParams();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="text-sm text-gray-500">
        
          {quotesLoading ? "Updating quotes…" : "Quotes up to ~15s cache."}
        </div>
        {totals && (
          <div className="text-right">
            <div className="text-sm text-gray-500">Portfolio P/L (since inception)</div>
            <p
              className={`font-bold mb-4 ${bundle.performance >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {bundle.performance >= 0 ? "+" : ""}
              {bundle.performance?.toFixed(2)}%
            </p>
          <button
          onClick={() => router.push(`/ETFTracker/${id}/live`)}
          className="ml-auto px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
          title="Open live performance view"
          >
          View Live Performance
          </button>
          </div>
        )}
      </div>

      {rulesError && <div className="text-red-600 text-sm">{rulesError}</div>}

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
              <th className="px-4 py-2 font-medium text-gray-600">All Time P/L</th>
              <th className="px-4 py-2 font-medium text-gray-600">Rule</th>
            </tr>
          </thead>
          <tbody>
            {bundle.assets.map((a: AssetRow) => {
              const key = a.ticker?.toUpperCase?.() || "";
              const q = quotes[key];
              const last = typeof q?.price === "number" ? q!.price : null;
              const prev = typeof q?.previousClose === "number" ? q!.previousClose : null;
              const qty = Number(a.shares ?? 1);
              const costPerShare = Number(a.open_price_usd ?? 0) || 0;
              const dayChange = last != null && prev != null ? last - prev : null;
              const pl = last != null ? (last - costPerShare) * qty : null;

              return (
                <tr key={a.linkId} className="border-t">
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
                    {dayChange != null ? `${dayChange >= 0 ? "+" : ""}${dayChange.toFixed(2)}` : "—"}
                  </td>
                  <td className={`px-4 py-2 ${pl != null ? (pl >= 0 ? "text-green-600" : "text-red-600") : ""}`}>
                    {pl != null ? `${pl >= 0 ? "+" : ""}${pl.toFixed(2)}` : "—"}
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={a.ruleId ?? ""}
                      onChange={(e) => onChangeRule(a.linkId, e.target.value ? Number(e.target.value) : null)}
                      disabled={rulesLoading}
                      className="min-w-52 border rounded-lg px-2 py-2 bg-white"
                    >
                      <option value="">{rulesLoading ? "Loading rules…" : "— No rules —"}</option>
                      {ruleOptions.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* --------- Rules Editor (wrapper + core) ---------- */
function ManagedRulesEditorInline({
  ruleId,
  ticker,
  bundleName,
  onCreateNew,
}: {
  ruleId: number | null;           // now a ruleId (can be null)
  ticker: string;
  bundleName: string;
  onCreateNew?: () => Promise<void>;
}) {
  // ⚠️ No hooks here.
  if (ruleId == null) {
    return (
      <div className="p-4 rounded-xl border space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Rules for {ticker} in {bundleName}</h2>
          <button
            onClick={onCreateNew}
            className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            disabled={!onCreateNew}
          >
            + Create New Rule
          </button>
        </div>
        <p className="text-sm text-gray-600">
          This asset has <span className="font-medium">no rule</span> selected. Create one or choose a rule in the Managed table.
        </p>
      </div>
    );
  }

  // Always render the core component when a rule exists (hooks live there)
  return (
    <ManagedRulesEditorCore
      ruleId={ruleId}
      ticker={ticker}
      bundleName={bundleName}
    />
  );
}

function ManagedRulesEditorCore({
  ruleId,
  ticker,
  bundleName,
}: {
  ruleId: number;
  ticker: string;
  bundleName: string;
}) {
  type RebalanceCadence = "off" | "daily" | "weekly" | "monthly" | "quarterly";
  type RuleMode = "threshold" | "schedule" | "off";

  type ManagedRuleSet = {
    id: number; // primary key of the rule
    name?: string | null;
    active: boolean;
    target_pct: number | null;
    rebalance: { mode: RuleMode; thresholdPct: number | null; cadence: RebalanceCadence };
    risk: { stopLossPct: number | null; takeProfitPct: number | null; trailing: boolean };
    dca: { enabled: boolean; every: "week" | "month"; quantity: number | null; dayOfWeek: number | null; dayOfMonth: number | null };
    notes: string | null;
    updated_at?: string;
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rules, setRules] = useState<ManagedRuleSet | null>(null);

  const defaultRules: ManagedRuleSet = {
    id: ruleId,
    name: null,
    active: true,
    target_pct: null,
    rebalance: { mode: "off", thresholdPct: null, cadence: "off" },
    risk: { stopLossPct: null, takeProfitPct: null, trailing: false },
    dca: { enabled: false, every: "week", quantity: null, dayOfWeek: 1, dayOfMonth: 1 },
    notes: null,
  };

  useEffect(() => {
    let abort = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/ETFTracker/api/managedRules/${ruleId}`, { method: "GET" });
        if (!res.ok) {
          if (res.status === 404) {
            if (!abort) setRules(defaultRules);
          } else {
            const j = await safeJson(res);
            throw new Error(j?.error || `Failed to load (${res.status})`);
          }
        } else {
          const j = await res.json();
          if (!abort) setRules(j as ManagedRuleSet);
        }
      } catch (e: any) {
        if (!abort) {
          setError(e?.message || "Failed to load rules");
          setRules(defaultRules);
        }
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => { abort = true; };
  }, [ruleId]); // stable hook order

  async function save() {
    if (!rules) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/ETFTracker/api/managedRules/${rules.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rules),
      });
      const j = await safeJson(res);
      if (!res.ok) throw new Error(j?.error || `Save failed (${res.status})`);
      setRules((j as ManagedRuleSet) || rules);
    } catch (e: any) {
      setError(e?.message || "Failed to save rules");
    } finally {
      setSaving(false);
    }
  }

  async function removeRules() {
    if (!confirm("Delete this rule? Assets using it will have no rule selected.")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/ETFTracker/api/managedRules/${ruleId}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await safeJson(res);
        throw new Error(j?.error || `Delete failed (${res.status})`);
      }
      setRules(null);
    } catch (e: any) {
      setError(e?.message || "Failed to delete rules");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !rules) {
    return <div className="p-4 animate-pulse text-gray-500">Loading rules…</div>;
  }

  return (
    <div className="p-4 rounded-xl border space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Rules for {ticker} in {bundleName}</h2>
        <div className="flex gap-2">
          <button onClick={removeRules} className="px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200">
            Delete Rule
          </button>
          <button
            onClick={save}
            disabled={saving}
            className={`px-3 py-2 rounded-lg text-white ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Optional name field */}
      <div className="rounded-xl border p-4 space-y-2">
        <label className="block text-sm text-gray-600 mb-1">Rule name (optional)</label>
        <input
          value={rules.name ?? ""}
          onChange={(e) => setRules({ ...rules, name: e.target.value || null })}
          className="w-full border rounded-lg px-3 py-2"
          placeholder={`Rule #${rules.id}`}
        />
      </div>

      {/* Activation */}
      <div className="rounded-xl border p-4 space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={rules.active}
            onChange={(e) => setRules({ ...rules, active: e.target.checked })}
          />
          <span className="font-medium">Enable managed rules for this asset</span>
        </label>
      </div>

      {/* Target Allocation */}
      <div className="rounded-xl border p-4 space-y-2">
        <h3 className="font-semibold">Target Allocation</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="0.01"
            min={0}
            max={100}
            value={rules.target_pct ?? ""}
            onChange={(e) => setRules({ ...rules, target_pct: e.target.value === "" ? null : Number(e.target.value) })}
            className="w-36 border rounded-lg px-3 py-2"
          />
          <span className="text-gray-500">%</span>
        </div>
      </div>

      {/* Rebalancing */}
      <div className="rounded-xl border p-4 space-y-3">
        <h3 className="font-semibold">Rebalancing</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Mode</label>
            <select
              value={rules.rebalance.mode}
              onChange={(e) => setRules({ ...rules, rebalance: { ...rules.rebalance, mode: e.target.value as any } })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="off">Off</option>
              <option value="threshold">Threshold drift</option>
              <option value="schedule">Scheduled</option>
            </select>
          </div>

          {rules.rebalance.mode === "threshold" && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Drift threshold</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={rules.rebalance.thresholdPct ?? ""}
                  onChange={(e) =>
                    setRules({
                      ...rules,
                      rebalance: {
                        ...rules.rebalance,
                        thresholdPct: e.target.value === "" ? null : Number(e.target.value),
                      },
                    })
                  }
                  className="w-36 border rounded-lg px-3 py-2"
                />
                <span className="text-gray-500">%</span>
              </div>
            </div>
          )}

          {rules.rebalance.mode === "schedule" && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Cadence</label>
              <select
                value={rules.rebalance.cadence}
                onChange={(e) => setRules({ ...rules, rebalance: { ...rules.rebalance, cadence: e.target.value as any } })}
                className="border rounded-lg px-3 py-2"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="off">Off</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Risk Controls */}
      <div className="rounded-xl border p-4 space-y-3">
        <h3 className="font-semibold">Risk Controls</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Stop loss</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                min={0}
                value={rules.risk.stopLossPct ?? ""}
                onChange={(e) => setRules({ ...rules, risk: { ...rules.risk, stopLossPct: e.target.value === "" ? null : Number(e.target.value) } })}
                className="w-28 border rounded-lg px-3 py-2"
              />
              <span className="text-gray-500">%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Take profit</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                min={0}
                value={rules.risk.takeProfitPct ?? ""}
                onChange={(e) => setRules({ ...rules, risk: { ...rules.risk, takeProfitPct: e.target.value === "" ? null : Number(e.target.value) } })}
                className="w-28 border rounded-lg px-3 py-2"
              />
              <span className="text-gray-500">%</span>
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rules.risk.trailing}
              onChange={(e) => setRules({ ...rules, risk: { ...rules.risk, trailing: e.target.checked } })}
            />
            <span>Use trailing stop</span>
          </label>
        </div>
      </div>

      {/* DCA */}
      <div className="rounded-xl border p-4 space-y-3">
        <h3 className="font-semibold">Dollar-Cost Averaging (DCA)</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={rules.dca.enabled}
            onChange={(e) => setRules({ ...rules, dca: { ...rules.dca, enabled: e.target.checked } })}
          />
          <span>Enable DCA</span>
        </label>

        {rules.dca.enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Every</label>
              <select
                value={rules.dca.every}
                onChange={(e) => setRules({ ...rules, dca: { ...rules.dca, every: e.target.value as any } })}
                className="border rounded-lg px-3 py-2"
              >
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Quantity (shares)</label>
              <input
                type="number"
                step="0.0001"
                min={0}
                value={rules.dca.quantity ?? ""}
                onChange={(e) => setRules({ ...rules, dca: { ...rules.dca, quantity: e.target.value === "" ? null : Number(e.target.value) } })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {rules.dca.every === "week" ? (
              <div>
                <label className="block text-sm text-gray-600 mb-1">Day of week</label>
                <select
                  value={rules.dca.dayOfWeek ?? 1}
                  onChange={(e) => setRules({ ...rules, dca: { ...rules.dca, dayOfWeek: Number(e.target.value) } })}
                  className="border rounded-lg px-3 py-2"
                >
                  <option value={0}>Sunday</option>
                  <option value={1}>Monday</option>
                  <option value={2}>Tuesday</option>
                  <option value={3}>Wednesday</option>
                  <option value={4}>Thursday</option>
                  <option value={5}>Friday</option>
                  <option value={6}>Saturday</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm text-gray-600 mb-1">Day of month</label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={rules.dca.dayOfMonth ?? 1}
                  onChange={(e) => setRules({ ...rules, dca: { ...rules.dca, dayOfMonth: Number(e.target.value) } })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="rounded-xl border p-4">
        <label className="block text-sm text-gray-600 mb-1">Notes</label>
        <textarea
          value={rules.notes ?? ""}
          onChange={(e) => setRules({ ...rules, notes: e.target.value || null })}
          rows={4}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Optional notes about this strategy…"
        />
      </div>
    </div>
  );
}

async function safeJson(r: Response) {
  try { return await r.json(); } catch { return null; }
}
