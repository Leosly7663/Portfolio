export type OrderType = "Market" | "PostOnly";
export type BundleType = "Spot" | "Managed";

export type PendingAsset = {
  ticker: string;
  shares: number;
  priceAtAdd: number | null;
  currency: string | null;
  inception: string;          // ISO
  ruleId?: number | null;
  limitPrice?: number | null; // strike for PostOnly
};

export type BundlePayload = {
  name: string;
  user_id: string;           // auth user id
  bundle_type: BundleType;
  order_type: OrderType;
  assets: Array<{
    ticker: string;
    shares: number;
    open_price_usd: number | null;
    inception_date?: string | null;
    rule_id?: number | null;
    limit_price?: number | null;
  }>;
  metadata?: {
    est_notional: number;
    est_fees: number;
  };
};

export type CreatePendingOrderRequest = {
  order_type: OrderType;
  bundle_payload: BundlePayload;
  est_notional: number;
  est_fees: number;
  est_total: number;
  currency?: string;
};

export type CreatePendingOrderResponse = {
  orderId: string;
};

export type ConfirmOrderResponse = {
  orderId: string;
  receiptNumber: string;
  balanceAfter?: number;
};

export type AccountBalanceResponse = {
  account_balance: number | null;
};
