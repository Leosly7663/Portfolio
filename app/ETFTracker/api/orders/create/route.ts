// app/api/orders/create/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type OrderType = "Market" | "PostOnly";
type BundleType = "Spot" | "Managed";

type BundleAsset = {
  ticker: string;
  shares: number;
  open_price_usd: number | null;
  inception_date?: string | null;
  rule_id?: number | null;
  limit_price?: number | null;
};

type BundlePayload = {
  name: string;
  user_id: string;           // auth.users.id
  bundle_type: BundleType;
  order_type: OrderType;
  assets: BundleAsset[];
  metadata?: { est_notional: number; est_fees: number };
};

type CreatePendingOrderBody = {
  order_type: OrderType;
  bundle_payload: BundlePayload;  // <-- NO orderId here
  est_notional: number;
  est_fees: number;
  est_total: number;
  currency?: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // server-only
  { auth: { persistSession: false } }
);

async function ensureAssetsExist(tickers: string[]) {
  const uniq = [...new Set(tickers.map(t => t.trim().toUpperCase()).filter(Boolean))];
  if (!uniq.length) return;

  const { data: existing, error: selErr } = await supabase
    .from("Soln0002 - Assets")
    .select("ticker")
    .in("ticker", uniq);
  if (selErr) throw new Error(selErr.message);

  const have = new Set((existing ?? []).map(r => r.ticker));
  const toInsert = uniq.filter(t => !have.has(t)).map(t => ({ ticker: t }));
  if (!toInsert.length) return;

  const { error: insErr } = await supabase.from("Soln0002 - Assets").insert(toInsert);
  if (insErr) throw new Error(insErr.message);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreatePendingOrderBody;
    const bp = body?.bundle_payload;

    // Validation (no orderId anywhere)
    if (!bp) return NextResponse.json({ error: "Missing bundle_payload" }, { status: 400 });
    if (!bp.user_id) return NextResponse.json({ error: "Unauthorized (missing user_id)" }, { status: 401 });
    if (!bp.name?.trim()) return NextResponse.json({ error: "Missing bundle name" }, { status: 400 });
    if (bp.bundle_type !== "Spot" && bp.bundle_type !== "Managed")
      return NextResponse.json({ error: "Invalid bundle type" }, { status: 400 });
    if (!Array.isArray(bp.assets) || bp.assets.length === 0)
      return NextResponse.json({ error: "Add at least one asset" }, { status: 400 });
    if (body.order_type !== "Market" && body.order_type !== "PostOnly")
      return NextResponse.json({ error: "Invalid order_type" }, { status: 400 });
    if (
      typeof body.est_notional !== "number" ||
      typeof body.est_fees !== "number" ||
      typeof body.est_total !== "number"
    ) {
      return NextResponse.json({ error: "Missing est_notional/fees/total" }, { status: 400 });
    }

    // Make sure all tickers exist (so confirm step can join by ticker)
    await ensureAssetsExist(bp.assets.map(a => a.ticker));

    // 1) Insert order — DB generates id (identity/bigint or uuid)
    const { data: orderRow, error: orderErr } = await supabase
      .from("Soln0002 - Orders")
      .insert({
        user_auth_id: bp.user_id,
        status: "pending",
        order_type: body.order_type,
        bundle_payload: bp,                 // keep payload for confirm
        est_notional: body.est_notional,
        est_fees: body.est_fees,
        est_total: body.est_total,
        currency: body.currency ?? "usd",
      })
      .select("id")
      .single();

    if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 500 });

    // Important: use raw PK type for child rows
    const orderPk = orderRow.id;          // number if BIGINT, string if UUID
    const orderId = String(orderPk);      // string for the client response

    // 2) Insert order items referenced to the new order id
    const items = bp.assets.map(a => ({
      order_id: orderPk,                  // <-- raw pk (no casting to string)
      ticker: (a.ticker || "").trim().toUpperCase(),
      shares: Number(a.shares || 0),
      intended_price:
        body.order_type === "PostOnly"
          ? (a.limit_price ?? a.open_price_usd)
          : a.open_price_usd,
      limit_price: body.order_type === "PostOnly" ? (a.limit_price ?? null) : null,
      currency: "usd",
      rule_id: a.rule_id ?? null,
    }));

    const { error: itemsErr } = await supabase
      .from("Soln0002 - Order Items")
      .insert(items);
    if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 });

    // 3) Return the new id (the only place the client sees it)
    return NextResponse.json({ orderId }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Create order failed" },
      { status: 500 }
    );
  }
}
