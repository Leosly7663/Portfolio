// app/api/orders/balance/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type BalanceBody = { id: string };

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // server-only
  { auth: { persistSession: false } }
);

// UUID v1–v5 regex (good enough for server validation)
const UUID_RX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  try {
    const { id } = (await req.json()) as BalanceBody;

    if (!id || typeof id !== "string" || !UUID_RX.test(id)) {
      return NextResponse.json({ error: "Invalid id (must be UUID)" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("Soln0002 - Users")
      .select("account_balance")
      .eq("auth_user_id", id)
      .single();

    if (error) {
      // Row not found vs other errors
      const status = /row\b.*\bnot\b.*\bfound/i.test(error.message) ? 404 : 400;
      return NextResponse.json({ error: error.message }, { status });
    }

    return NextResponse.json(
      { id, account_balance: data?.account_balance ?? null },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Balance lookup failed" },
      { status: 500 }
    );
  }
}
