"use client";

import React from "react";
import Link from "next/link";
import { BundleCardGrid } from "./bundleCardGrid";
import { CreateBundlePanel } from "./createBundlePannel";
import { useBundles } from "./useBundles";
import ProfilePanel from "./profilePanel"; // 🔹 add

export default function BundlesPage() {
  const { SpotBundles, ManagedBundles, loading, refreshPerformance, updating } = useBundles();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
    <h1 className="text-2xl font-bold mb-6">Hybrid ETF Tracker</h1>
      {/* 🔹 New: Auth + Profile */}
      <ProfilePanel />

      <CreateBundlePanel onRefresh={refreshPerformance} refreshing={updating} />

      {loading ? (
        <p className="text-gray-500">Loading bundles…</p>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Spot ETFs</h2>
            <BundleCardGrid bundles={SpotBundles} />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Managed ETFs</h2>
            <BundleCardGrid bundles={ManagedBundles} />
          </section>
        </>
      )}
    </div>
  );
}
