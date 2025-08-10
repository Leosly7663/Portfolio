"use client";
import { useMemo, useState } from "react";
import { computeFees } from "./components/orders/fees";
import type { PendingAsset, OrderType, BundleType, BundlePayload } from "./components/orders/types";

export function useOrderPlacement() {
  const [orderType, setOrderType] = useState<OrderType>("Market");
  const [bundleType, setBundleType] = useState<BundleType>("Spot");
  const [pending, setPending] = useState<PendingAsset[]>([]);
  const [bundleName, setBundleName] = useState("");
  const [accountBalance, setAccountBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const totalShares = useMemo(
    () => pending.reduce((s, a) => s + (Number(a.shares) || 0), 0),
    [pending]
  );

  const intendedPrice = (a: PendingAsset) =>
    orderType === "PostOnly" ? a.limitPrice ?? a.priceAtAdd ?? 0 : a.priceAtAdd ?? 0;

  const notional = useMemo(
    () => pending.reduce((s, a) => s + intendedPrice(a) * (Number(a.shares) || 0), 0),
    [pending, orderType]
  );

  const { fees, total } = useMemo(() => computeFees(notional), [notional]);

 async function fetchBalance(userId: string) {
  const res = await fetch("ETFTracker/api/orders/balance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id : userId }),
  });
  const j = await res.json();
  if (res.ok) setAccountBalance(j.account_balance ?? null);
  else throw new Error(j.error || "Failed to load balance");
}

// change confirm() to accept userId and send it:
async function confirm(orderId: string, userId: string) {
  if (accountBalance != null && total > accountBalance + 1e-9)
    throw new Error("Insufficient balance to place this order.");

  setLoading(true);
  try {
    const res = await fetch("ETFTracker/api/orders/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId }), // <- UUID string
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j.error || "Failed to confirm order");
    return j as { orderId: string; receiptNumber: string; balanceAfter?: number };
  } finally {
    setLoading(false);
  }
}

  function buildPayload(userId: string): BundlePayload {
    const now = new Date().toISOString();
    return {
      name: bundleName.trim(),
      user_id: userId,
      bundle_type: bundleType,
      order_type: orderType,
      assets: pending.map((a) => ({
        ticker: a.ticker,
        shares: a.shares || 1,
        open_price_usd:
          orderType === "Market" ? a.priceAtAdd ?? null : (a.limitPrice ?? a.priceAtAdd ?? null),
        inception_date: orderType === "Market" ? now : a.inception,
        rule_id: bundleType === "Managed" ? a.ruleId ?? null : undefined,
        limit_price: orderType === "PostOnly" ? a.limitPrice ?? null : null,
      })),
      metadata: {
        est_notional: notional,
        est_fees: fees,
      },
    };
  }

  async function createPending(userId: string) {
    if (!bundleName.trim()) throw new Error("Please enter a bundle name.");
    if (!pending.length) throw new Error("Add at least one asset.");
    if (orderType === "PostOnly") {
      const missing = pending.filter((p) => !(p.limitPrice && p.limitPrice > 0));
      if (missing.length) throw new Error(`Enter strike price for: ${missing.map(m=>m.ticker).join(", ")}`);
    }

    setLoading(true);
    try {
      const payload = buildPayload(userId);
      const res = await fetch("ETFTracker/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_type: orderType,
          bundle_payload: payload,
          est_notional: notional,
          est_fees: fees,
          est_total: total,
          currency: "usd",
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed to create order");
      return j.orderId as string;
    } finally {
      setLoading(false);
    }
  }

  return {
    state: {
      orderType, setOrderType,
      bundleType, setBundleType,
      pending, setPending,
      bundleName, setBundleName,
      accountBalance,
      totals: { notional, fees, total, totalShares },
      loading,
    },
    actions: {
      fetchBalance,
      createPending,
      confirm,
    },
  };
}
