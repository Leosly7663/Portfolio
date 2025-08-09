// app/api/bundles/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type NewBundleAsset = {
  ticker: string;            // e.g., "AAPL" or "RY.TO"
  shares?: number;         // default 1
  open_price_USD?: number | null;// optional; can be null
  inception_date?: string;   // ISO string; server will default if missing
};

type NewBundleBody = {
  name: string;
  type: "Live" | "Demo";
  assets: NewBundleAsset[];
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // server-only
  { auth: { persistSession: false } }
);

async function getOrCreateAssetId(ticker: string): Promise<number> {
  // try find
  {
    const { data, error } = await supabase
      .from("Soln0002 - Assets")
      .select("id")
      .eq("ticker", ticker)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (data?.id) return data.id as number;
  }
  // insert
  {
    const { data, error } = await supabase
      .from("Soln0002 - Assets")
      .insert([{ ticker }])
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return data.id as number;
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as NewBundleBody;

    // basic validation
    if (!body?.name?.trim()) {
      return NextResponse.json({ error: "Missing bundle name" }, { status: 400 });
    }
    if (body.type !== "Live" && body.type !== "Demo") {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
    if (!Array.isArray(body.assets) || body.assets.length === 0) {
      return NextResponse.json({ error: "Add at least one asset" }, { status: 400 });
    }

    const name = body.name.trim();
    const nowIso = new Date().toISOString();

    // 1) create bundle
    const { data: bundleRow, error: bundleErr } = await supabase
      .from("Soln0002 - Bundles")
      .insert([{ name, type: body.type, bundle_PL: 0 }])
      .select("id")
      .single();

    if (bundleErr) {
      return NextResponse.json({ error: bundleErr.message }, { status: 500 });
    }
    const bundleId = bundleRow.id as number;

    // 2) build link rows
    const linkRows: any[] = [];
    for (const a of body.assets) {
      const ticker = (a.ticker || "").trim().toUpperCase();
      if (!ticker) continue;

      const assetId = await getOrCreateAssetId(ticker);

      const quantity = Number(a.shares ?? 1);
      const openPrice = a.open_price_USD ?? null;

      // Live: inception forced to now; Demo: use provided or now
      const inceptionIso =
        body.type === "Live"
          ? nowIso
          : a.inception_date
          ? new Date(a.inception_date).toISOString()
          : nowIso;

      linkRows.push({
        bundle_id: bundleId,
        asset_id: assetId,
        open_price_USD: openPrice,
        shares: quantity,
        inception_date: inceptionIso,
      });
    }

    if (!linkRows.length) {
      return NextResponse.json({ error: "No valid assets to insert" }, { status: 400 });
    }

    // 3) insert links
    const { error: linkErr } = await supabase
      .from("Soln0002 - Assets to Bundles")
      .insert(linkRows);

    if (linkErr) {
      return NextResponse.json({ error: linkErr.message }, { status: 500 });
    }

    return NextResponse.json({ id: bundleId }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Create bundle failed" },
      { status: 500 }
    );
  }
}
