"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// Adjust this import path if your supabaseClient lives elsewhere:
import { supabase } from "../../../Lib/supabase/supabaseClient";

type Asset = { id: number; ticker: string };
type Bar5s = { asset_id: number; bucket_start_ms: number; open: number; high: number; low: number; close: number; volume: number; trade_count: number };
type LastRow = { id: number; ticker: string; last_price_usd: number | null; last_trade_ts_ms: number | null };

const HISTORY_5S_TABLE = `Soln0002 - Asset OHLCV 5s`;

export default function LivePerformancePage() {
  const { id } = useParams();
  const router = useRouter();

  const [bundleName, setBundleName] = useState<string>("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [barsByAsset, setBarsByAsset] = useState<Record<number, Bar5s[]>>({});
  const [lastByAsset, setLastByAsset] = useState<Record<number, LastRow>>({});
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [rangeMin, setRangeMin] = useState<5 | 15 | 60>(15); // 5, 15, or 60 minutes

  // Fetch bundle meta + assets
  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      // 1) bundle name + asset list
      const { data: bundle, error: bErr } = await supabase
        .from("Soln0002 - Bundles")
        .select(`
          id, name,
          assets:"Soln0002 - Assets to Bundles"(
            asset:"Soln0002 - Assets"(id, ticker)
          )
        `)
        .eq("id", Number(id))
        .maybeSingle();

      if (bErr || !bundle) {
        console.error(bErr);
        setAssets([]);
        setLoading(false);
        return;
      }

      setBundleName(bundle.name || `Bundle #${id}`);

      const a: Asset[] =
        (bundle.assets || [])
          .map((row: any) => row?.asset)
          .filter(Boolean)
          .map((ar: any) => ({ id: ar.id as number, ticker: ar.ticker as string }));

      setAssets(a);
      setLoading(false);
    })();
  }, [id]);

  // Fetch OHLCV + last prices for current range
  async function refresh() {
    if (!assets.length) return;
    const sinceMs = Date.now() - rangeMin * 60 * 1000;
    const assetIds = assets.map(a => a.id);

    // OHLCV 5s bars
    const { data: bars, error: barsErr } = await supabase
      .from(HISTORY_5S_TABLE)
      .select("asset_id,bucket_start_ms,open,high,low,close,volume,trade_count")
      .in("asset_id", assetIds)
      .gte("bucket_start_ms", sinceMs)
      .order("bucket_start_ms", { ascending: true });

    if (barsErr) console.error("barsErr", barsErr);

    const grouped: Record<number, Bar5s[]> = {};
    (bars || []).forEach((b: any) => {
      const aid = Number(b.asset_id);
      if (!grouped[aid]) grouped[aid] = [];
      grouped[aid].push({
        asset_id: aid,
        bucket_start_ms: Number(b.bucket_start_ms),
        open: Number(b.open),
        high: Number(b.high),
        low: Number(b.low),
        close: Number(b.close),
        volume: Number(b.volume),
        trade_count: Number(b.trade_count),
      });
    });
    setBarsByAsset(grouped);

    // Last prices (from assets table)
    const { data: lastRows, error: lastErr } = await supabase
      .from("Soln0002 - Assets")
      .select("id,ticker,last_price_usd,last_trade_ts_ms")
      .in("id", assetIds);

    if (lastErr) console.error("lastErr", lastErr);

    const lastMap: Record<number, LastRow> = {};
    (lastRows || []).forEach((r: any) => {
      lastMap[Number(r.id)] = {
        id: Number(r.id),
        ticker: r.ticker as string,
        last_price_usd: r.last_price_usd != null ? Number(r.last_price_usd) : null,
        last_trade_ts_ms: r.last_trade_ts_ms != null ? Number(r.last_trade_ts_ms) : null,
      };
    });
    setLastByAsset(lastMap);
  }

  // Initial + auto refresh
  useEffect(() => {
    refresh();
  }, [assets, rangeMin]);

  useEffect(() => {
    if (!autoRefresh) return;
    const t = setInterval(() => refresh(), 5000);
    return () => clearInterval(t);
  }, [autoRefresh, assets, rangeMin]);

  const cards = useMemo(() => {
    return assets.map((a) => {
      const series = barsByAsset[a.id] || [];
      const closes = series.map(s => s.close);
      const last = lastByAsset[a.id]?.last_price_usd ?? (closes.length ? closes[closes.length - 1] : null);
      const tsMs = lastByAsset[a.id]?.last_trade_ts_ms ?? null;

      const close1m = pickNthFromEnd(closes, Math.floor(60/5));   // ~1m ago (12 bars/min? but 5s bars -> 12 bars/min)
      const close5m = pickNthFromEnd(closes, Math.floor(5*60/5));
      const close15m = pickNthFromEnd(closes, Math.floor(15*60/5));

      const ch1m = last != null && close1m != null ? last - close1m : null;
      const ch5m = last != null && close5m != null ? last - close5m : null;
      const ch15m = last != null && close15m != null ? last - close15m : null;

      return { a, last, tsMs, closes, ch1m, ch5m, ch15m };
    });
  }, [assets, barsByAsset, lastByAsset]);

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-6 text-gray-500">Loading…</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">Live Performance — {bundleName}</h1>
        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
            Auto refresh (5s)
          </label>
          <select
            value={rangeMin}
            onChange={(e) => setRangeMin(Number(e.target.value) as any)}
            className="border rounded-lg px-2 py-1 text-sm"
            title="Window"
          >
            <option value={5}>Last 5m</option>
            <option value={15}>Last 15m</option>
            <option value={60}>Last 60m</option>
          </select>
          <button
            onClick={refresh}
            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            Refresh now
          </button>
        </div>
      </div>

      {/* Grid of asset cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map(({ a, last, tsMs, closes, ch1m, ch5m, ch15m }) => {
          const line = normalizeToSparkline(closes, 120); // cap to ~120 points
          return (
            <div key={a.id} className="rounded-2xl border p-4 shadow-sm bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{a.ticker}</div>
                <div className="text-sm text-gray-500">
                  {tsMs ? new Date(tsMs).toLocaleTimeString() : "—"}
                </div>
              </div>

              {/* Sparkline */}
              <Sparkline points={line} />

              {/* Stats */}
              <div className="mt-3 grid grid-cols-4 gap-2 text-sm">
                <div>
                  <div className="text-gray-500">Last</div>
                  <div className="font-medium">{fmt(last)}</div>
                </div>
                <Delta label="1m" v={ch1m} />
                <Delta label="5m" v={ch5m} />
                <Delta label="15m" v={ch15m} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Raw table (optional, handy for debug) */}
      <div className="rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-3 py-2">Ticker</th>
              <th className="px-3 py-2">Bars</th>
              <th className="px-3 py-2">Latest Close</th>
              <th className="px-3 py-2">Last Trade Time</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(a => {
              const series = barsByAsset[a.id] || [];
              const lastClose = series.length ? series[series.length - 1].close : (lastByAsset[a.id]?.last_price_usd ?? null);
              const ts = lastByAsset[a.id]?.last_trade_ts_ms ?? null;
              return (
                <tr key={a.id} className="border-t">
                  <td className="px-3 py-2 font-semibold">{a.ticker}</td>
                  <td className="px-3 py-2">{series.length}</td>
                  <td className="px-3 py-2">{fmt(lastClose)}</td>
                  <td className="px-3 py-2">{ts ? new Date(ts).toLocaleTimeString() : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

function Delta({ label, v }: { label: string; v: number | null }) {
  const pos = (v ?? 0) >= 0;
  return (
    <div>
      <div className="text-gray-500">{label}</div>
      <div className={v == null ? "text-gray-400" : pos ? "text-green-600" : "text-red-600"}>
        {v == null ? "—" : `${pos ? "+" : ""}${v.toFixed(2)}`}
      </div>
    </div>
  );
}

// Mini sparkline in pure SVG
function Sparkline({ points }: { points: number[] }) {
  const w = 300, h = 80, pad = 6;
  if (!points.length) return <div className="h-20 bg-gray-50 rounded-md" />;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = Math.max(1e-9, max - min);
  const xs = points.map((_, i) => pad + (i / Math.max(1, points.length - 1)) * (w - pad * 2));
  const ys = points.map(v => pad + (1 - (v - min) / span) * (h - pad * 2));
  const d = xs.map((x, i) => `${i ? "L" : "M"} ${x.toFixed(2)} ${ys[i].toFixed(2)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// Helpers
function fmt(n: number | null | undefined) {
  if (n == null) return "—";
  return n >= 100 ? n.toFixed(2) : n.toFixed(4);
}
function pickNthFromEnd(arr: number[], n: number): number | null {
  if (!arr.length || n <= 0) return null;
  const idx = arr.length - n;
  return idx >= 0 ? arr[idx] : null;
}
function normalizeToSparkline(arr: number[], maxPoints: number) {
  if (arr.length <= maxPoints) return arr;
  const step = Math.ceil(arr.length / maxPoints);
  const out: number[] = [];
  for (let i = 0; i < arr.length; i += step) out.push(arr[i]);
  // ensure last point is included
  if (out[out.length - 1] !== arr[arr.length - 1]) out.push(arr[arr.length - 1]);
  return out;
}
