// app/api/bundles/recompute/route.ts
import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type AssetRecord = { ticker?: string | null } | null;
type AssetRecordMaybeArray = AssetRecord | AssetRecord[] | null;

type LinkRow = {
  open_price_usd?: number | null;
  shares?: number | null;
  asset?: AssetRecordMaybeArray;
};

type BundleRow = {
  id: number;
  name: string;
  assets?: LinkRow[] | null;
};

type Quote = { price: number | null; previousClose: number | null; currency: string | null };

// ✅ SERVER-SIDE Supabase client (service role bypasses RLS)
// Do NOT import your client-side supabase file here.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // keep this ONLY on server
  { auth: { persistSession: false } }
);

// Safely extract a ticker whether `asset` is an object or an array
function getTicker(asset: AssetRecordMaybeArray): string | null {
  if (!asset) return null;
  if (Array.isArray(asset)) {
    const t = asset[0]?.ticker ?? null;
    return t ? String(t) : null;
  }
  const t = asset?.ticker ?? null;
  return t ? String(t) : null;
}

async function getQuotesMap(symbols: string[]): Promise<Record<string, Quote>> {
  try {
    const res = await yahooFinance.quote(symbols);
    const arr = Array.isArray(res) ? res : [res];

    const out: Record<string, Quote> = {};
    for (const q of arr) {
      if (!q || typeof q !== "object") continue;
      const sym = String((q as any).symbol ?? "").toUpperCase();
      if (!sym) continue;

      const priceRaw = (q as any).regularMarketPrice;
      const prevRaw = (q as any).regularMarketPreviousClose;
      const ccyRaw = (q as any).currency;

      out[sym] = {
        price: typeof priceRaw === "number" ? priceRaw : null,
        previousClose: typeof prevRaw === "number" ? prevRaw : null,
        currency: typeof ccyRaw === "string" ? ccyRaw : null,
      };
    }
    return out;
  } catch (e) {
    console.error("yahooFinance.quote error:", e);
    throw e;
  }
}

export async function POST() {
  try {
    // 1) Load bundles
    const { data, error } = await supabase
      .from("Soln0002 - Bundles")
      .select(`
        id, name,
        assets: "Soln0002 - Assets to Bundles" (
          open_price_usd, shares,
          asset: "Soln0002 - Assets" ( ticker )
        )
      `);

    if (error) {
      console.error("Supabase select error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const bundles = (data ?? []) as unknown as BundleRow[];

    // 2) Collect symbols and fetch quotes once
    const symbols = Array.from(
      new Set(
        bundles
          .flatMap((b) => (b.assets ?? []).map((r) => getTicker(r.asset)))
          .filter((t): t is string => Boolean(t))
          .map((t) => t.toUpperCase())
      )
    );

    const quotesMap: Record<string, Quote> =
      symbols.length ? await getQuotesMap(symbols) : {};

    // 3) Compute and update each bundle
    let updated = 0;

    for (const b of bundles) {
      let totalCost = 0;
      let totalMkt = 0;
      let anyPrice = false;

      for (const r of b.assets ?? []) {
        const t = getTicker(r.asset);
        if (!t) continue;

        const last = quotesMap[t.toUpperCase()]?.price ?? null;
        const qty = Number(r.shares ?? 1);
        const cost = Number(r.open_price_usd ?? 0) * qty;

        totalCost += cost;
        if (last != null) {
          totalMkt += last * qty;
          anyPrice = true;
        }
      }

      if (!anyPrice || totalCost === 0) continue;

      const plPct = ((totalMkt - totalCost) / totalCost) * 100;
      const rounded = Math.round(plPct * 100) / 100;

      const { error: updErr } = await supabase
        .from("Soln0002 - Bundles")
        .update({
          bundle_pl: rounded,
          last_updated_at: new Date().toISOString(),
        })
        .eq("id", b.id);

      if (updErr) {
        console.error(`Update failed for bundle ${b.id}:`, updErr);
        continue;
      }
      updated++;
    }

    return NextResponse.json({ updated, total: bundles.length });
  } catch (e: any) {
    console.error("Recompute route fatal error:", e?.message || e);
    // Return a sanitized error so you see *something* in the client
    return NextResponse.json(
      { error: e?.message || "Internal error" },
      { status: 500 }
    );
  }
}
