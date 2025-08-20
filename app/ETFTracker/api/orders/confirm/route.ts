// app/api/orders/confirm/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type ConfirmBody = { id: string };

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // server-only
  { auth: { persistSession: false } }
);

// simple UUID v1–v5 regex (good enough for server validation)
const UUID_RX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  try {
    const { id } = (await req.json()) as ConfirmBody;

    if (!id || typeof id !== "string" || !UUID_RX.test(id)) {
      return NextResponse.json({ error: "Invalid id (must be UUID)" }, { status: 400 });
    }

    // Ensure the order exists and is pending; capture user for balance lookup
    const { data: ord, error: ordErr } = await supabase
      .from("Soln0002 - Orders")
      .select("id, user_auth_id, status")
      .eq("id", id)
      .single();

    if (ordErr) return NextResponse.json({ error: ordErr.message }, { status: 400 });
    if (!ord)   return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (ord.status !== "pending") {
      return NextResponse.json({ error: "Order is not pending" }, { status: 409 });
    }

    // Confirm atomically (UUID variant)
    const { error: rpcErr } = await supabase.rpc("soln0002_confirm_order", {
      p_order_id: id,
    });
    if (rpcErr) {
      return NextResponse.json({ error: rpcErr.message }, { status: 400 });
    }

    // Fetch receipt and the user's balance after confirmation
    const [{ data: rec }, { data: bal }] = await Promise.all([
      supabase
        .from("Soln0002 - Orders")
        .select("receipt_number")
        .eq("id", id)
        .single(),
      supabase
        .from("Soln0002 - Users")
        .select("account_balance")
        .eq("auth_user_id", ord.user_auth_id)
        .single(),
    ]);

    return NextResponse.json(
      {
        id,
        receiptNumber: rec?.receipt_number ?? null,
        balanceAfter: bal?.account_balance ?? null,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Confirm order failed" },
      { status: 500 }
    );
  }
}
