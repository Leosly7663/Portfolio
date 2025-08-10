import React from "react";
import Link from "next/link";
import type { BundleRow } from "./useBundles";

export function BundleCardGrid({ bundles }: { bundles: BundleRow[] }) {
  if (!bundles?.length) return <p className="text-gray-500">No items.</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {bundles.map((b) => (
        <Link key={b.id} href={`/ETFTracker/${b.id}`}>
          <div className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition border cursor-pointer">
            <h2 className="text-lg font-semibold mb-2">{b.name}</h2>
            <div className="flex space-x-2 mb-3">
              {b.assets.slice(0, 3).map((a) => (
                <span key={a.id} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md">
                  {a.ticker}
                </span>
              ))}
            </div>
            <p className={`font-bold ${typeof b.bundle_PL === "number" ? (b.bundle_PL >= 0 ? "text-green-600" : "text-red-600") : "text-gray-500"}`}>
              {typeof b.bundle_PL === "number" ? `${b.bundle_PL >= 0 ? "+" : ""}${b.bundle_PL.toFixed(2)}%` : "—"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}