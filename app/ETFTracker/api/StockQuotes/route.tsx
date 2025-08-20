// app/api/quotes/route.ts
import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export const runtime = "nodejs";        // use Node runtime
export const dynamic = "force-dynamic"; // no prerender
export const revalidate = 0;            // disable ISR

type QuoteOut = { price: number | null; previousClose: number | null; currency: string | null };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbolsParam = searchParams.get("symbols") || "";
  const symbols = symbolsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!symbols.length) {
    return NextResponse.json({ error: "No symbols" }, { status: 400 });
  }

  try {
    // yahoo-finance2 supports arrays of symbols
    // It returns an array for multiple symbols, or a single object for one symbol.
    const result = await yahooFinance.quote(symbols as any);

    const quotes: Record<string, QuoteOut> = {};

    const pushOne = (q: any) => {
      if (!q || !q.symbol) return;
      const key = String(q.symbol).toUpperCase();
      quotes[key] = {
        price: q.regularMarketPrice ?? null,
        previousClose: q.regularMarketPreviousClose ?? null,
        currency: q.currency ?? null,
      };
    };

    if (Array.isArray(result)) {
      for (const q of result) pushOne(q);
    } else {
      pushOne(result);
    }

    return NextResponse.json({ quotes });
  } catch (err: any) {
    // Library throws rich errors (e.g., when a symbol is invalid). Return a clean 502.
    return NextResponse.json(
      { error: err?.message || "Upstream quote error" },
      { status: 502 }
    );
  }
}
