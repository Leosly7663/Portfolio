
// app/api/orders/watch-limits/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import yahooFinance from "yahoo-finance2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Quote = { price: number | null; previousClose: number | null; currency?: string | null };

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // server-only
  { auth: { persistSession: false } }
);

// Normalize / fallback
function lastTradeFrom(q?: any): number | null {
  if (!q) return null;
  const p = typeof q.regularMarketPrice === "number" ? q.regularMarketPrice : null;
  const prev = typeof q.regularMarketPreviousClose === "number" ? q.regularMarketPreviousClose : null;
  return p ?? prev ?? null;
}


// 👇 put all your current POST logic into this function
async function runWatcher() {
  try {
    // 1) Find active limit/post-only orders
    const { data: orders, error: ordErr } = await supabase
      .from('Soln0002 - Orders')
      .select('id')
      .eq('status', 'confirmed')
      .in('order_type', ['Limit','PostOnly'] as any);

    if (ordErr) throw ordErr;
    const orderIds = (orders ?? []).map(o => o.id);
    if (!orderIds.length) {
      return NextResponse.json({ checked: 0, filledItems: 0, completedOrders: 0, msg: "No active limit orders." });
    }

    // 2) Pull order items that still need filling + have a limit price
    const { data: itemsRaw, error: itErr } = await supabase
      .from('Soln0002 - Order Items')
      .select('id, order_id, asset_bundle_link_id, ticker, shares, filled, limit_price')
      .in('order_id', orderIds)
      .not('limit_price', 'is', null);

    if (itErr) throw itErr;

    const items = (itemsRaw ?? []).filter(r => {
      const shares = Number(r.shares ?? 0);
      const filled = Number(r.filled ?? 0);
      return shares > filled; // needs fill
    });

    if (!items.length) {
      return NextResponse.json({ checked: 0, filledItems: 0, completedOrders: 0, msg: "No items pending fill." });
    }

    // 3) Fetch quotes (unique tickers)
    const symbols = Array.from(new Set(items.map(i => (i.ticker || '').toUpperCase()).filter(Boolean)));
    const qres = await yahooFinance.quote(symbols);
    const arr = Array.isArray(qres) ? qres : [qres];
    const qmap: Record<string, number | null> = {};
    for (const q of arr) {
      const sym = String((q as any).symbol ?? "").toUpperCase();
      if (!sym) continue;
      qmap[sym] = lastTradeFrom(q);
    }

    // 4) Decide fills (assume BUY side: execute when last <= limit)
    type FillPlan = { itemId: number; orderId: number; linkId: number; exec: number; newFilled: number };
    const plans: FillPlan[] = [];
    for (const it of items) {
      const sym = (it.ticker || '').toUpperCase();
      const last = qmap[sym];
      const lim = Number(it.limit_price);
      if (last == null || !isFinite(lim)) continue;

      // BUY logic: fill when market <= limit
      if (last <= lim) {
        const shares = Number(it.shares ?? 0);
        const filled = Number(it.filled ?? 0);
        const remaining = Math.max(0, shares - filled);
        if (remaining > 0) {
          const exec = Math.min(last, lim); // typical limit execution
          plans.push({
            itemId: it.id,
            orderId: it.order_id,
            linkId: it.asset_bundle_link_id,
            exec,
            newFilled: shares, // full fill; swap to partial if needed
          });
        }
      }
    }

    if (!plans.length) {
      return NextResponse.json({ checked: items.length, filledItems: 0, completedOrders: 0, msg: "No triggers hit." });
    }

    // 5) Apply fills (update items). Keep it simple: one-by-one with guards.
    let applied = 0;
    const touchedLinks = new Set<number>();
    const touchedOrders = new Set<number>();

    for (const p of plans) {
      // Guard: only update if still not filled
      const { error: upErr } = await supabase
        .from('Soln0002 - Order Items')
        .update({
          filled: p.newFilled,
          quote_price: p.exec
        })
        .eq('id', p.itemId)
        .lt('filled', p.newFilled); // avoid re-applying

      if (!upErr) {
        applied++;
        if (p.linkId) touchedLinks.add(p.linkId);
        if (p.orderId) touchedOrders.add(p.orderId);
      } else {
        console.error('Update item failed', p.itemId, upErr.message);
      }
    }

    // 6) Recompute open_price_USD for touched link rows (weighted avg of filled items)
    //    Use a tiny SQL helper for accuracy & atomicity.
    for (const linkId of touchedLinks) {
      await supabase.rpc('soln0002_recalc_link_open_price', { p_link_id: linkId });
    }

    // 7) If an order now has all items filled, mark it filled
    let completed = 0;
    for (const oid of touchedOrders) {
      const { data: chk, error: chkErr } = await supabase
        .from('Soln0002 - Order Items')
        .select('shares, filled')
        .eq('order_id', oid);

      if (chkErr) continue;
      const allFilled = (chk ?? []).every(r =>
        Number(r.filled ?? 0) >= Number(r.shares ?? 0)
      );

      if (allFilled) {
        const { error: oErr } = await supabase
          .from('Soln0002 - Orders')
          .update({ status: 'filled', filled_at: new Date().toISOString() })
          .eq('id', oid)
          .eq('status', 'confirmed');
        if (!oErr) completed++;
      }
    }

    return NextResponse.json({
      checked: items.length,
      filledItems: applied,
      updatedLinks: touchedLinks.size,
      completedOrders: completed
    });
  } catch (e: any) {
    console.error('watch-limits fatal:', e?.message || e);
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}

// tiny helper
function isAuthorized(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  return process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return new Response("Unauthorized", { status: 401 });
  return runWatcher();
}

export async function POST(req: NextRequest) {
  // keep POST for manual triggering too (you can keep the same auth if you want)
  if (!isAuthorized(req)) return new Response("Unauthorized", { status: 401 });
  return runWatcher();
}


