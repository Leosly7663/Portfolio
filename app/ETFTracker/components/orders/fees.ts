// Centralize fee policy
export const FEE_FLAT = 1.0;   // $1 per order
export const FEE_BPS = 10;     // 10 bps = 0.10%

export function computeFees(notional: number) {
  const variable = notional * (FEE_BPS / 10_000);
  const fees = FEE_FLAT + variable;
  return { fees, total: notional + fees };
}
