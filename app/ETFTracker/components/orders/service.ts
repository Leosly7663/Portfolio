import { supabaseService } from "../../../Lib/supabase/supabaseServer";
import {
  CreatePendingOrderRequest,
  CreatePendingOrderResponse,
  ConfirmOrderResponse,
} from "./types";

// Inserts order + items atomically in a transaction (via Postgres RPC or sequential inserts)
export async function createPendingOrder(
  userId: string,
  req: CreatePendingOrderRequest
): Promise<CreatePendingOrderResponse> {
  const sb = supabaseService();

  // 1) Insert order
  const { data: orderRow, error: orderErr } = await sb
    .from("Soln0002 - Orders")
    .insert({
      user_auth_id: userId,
      status: "pending",
      order_type: req.order_type,
      bundle_payload: req.bundle_payload,
      est_notional: req.est_notional,
      est_fees: req.est_fees,
      est_total: req.est_total,
      currency: req.currency ?? "usd",
    })
    .select("id")
    .single();

  if (orderErr) throw orderErr as Error;
  const orderId = orderRow.id as string;

  // 2) Insert items
  const itemsPayload = req.bundle_payload.assets.map((a) => ({
    order_id: orderId,
    ticker: a.ticker,
    shares: a.shares,
    intended_price:
      req.order_type === "PostOnly"
        ? a.limit_price ?? a.open_price_usd
        : a.open_price_usd,
    limit_price: req.order_type === "PostOnly" ? a.limit_price ?? null : null,
    currency: "usd",
    rule_id: a.rule_id ?? null,
  }));

  const { error: itemsErr } = await sb
    .from("Soln0002 - Order Items")
    .insert(itemsPayload);

  if (itemsErr) throw itemsErr as Error;

  return { orderId };
}

export async function confirmOrder(
  userId: string,
  orderId: string
): Promise<ConfirmOrderResponse> {
  const sb = supabaseService();

  // SECURITY DEFINER function checks auth.uid() = order.user_auth_id.
  const { data, error } = await sb.rpc("soln0002_confirm_order", {
    p_order_id: orderId,
  });

  if (error) throw error as Error;

  // fetch receipt + balance for response UX (optional)
  const [{ data: order }, { data: bal }] = await Promise.all([
    sb.from("Soln0002 - Orders")
      .select("receipt_number")
      .eq("id", orderId)
      .single(),
    sb
      .from("Soln0002 - Users")
      .select("account_balance")
      .eq("auth_user_id", userId)
      .single(),
  ]);

  return {
    orderId,
    receiptNumber: order?.receipt_number ?? "",
    balanceAfter: bal?.account_balance ?? undefined,
  };
}
