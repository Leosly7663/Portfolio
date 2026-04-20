// app/api/orders/balance/route.ts
import { NextResponse } from "next/server";
import {
  getServerSupabase,
  SERVER_SUPABASE_UNAVAILABLE_MESSAGE,
} from "../_lib/serverSupabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type BalanceBody = { id: string };

const UUID_RX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  try {
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: SERVER_SUPABASE_UNAVAILABLE_MESSAGE },
        { status: 503 }
      );
    }

    const { id } = (await req.json()) as BalanceBody;

    if (!id || typeof id !== "string" || !UUID_RX.test(id)) {
      return NextResponse.json(
        { error: "Invalid id (must be UUID)" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("Soln0002 - Users")
      .select("account_balance")
      .eq("auth_user_id", id)
      .single();

    if (error) {
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
