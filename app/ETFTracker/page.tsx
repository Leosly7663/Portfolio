"use client";

import React from "react";
import { BundleCardGrid } from "./bundleCardGrid";
import { CreateBundlePanel } from "./createBundlePannel";
import { useBundles } from "./useBundles";
import ProfilePanel from "./profilePanel";

export default function BundlesPage() {
  const {
    SpotBundles,
    ManagedBundles,
    loading,
    refreshPerformance,
    updating,
    usingBackup,
    sourceMessage,
  } = useBundles();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Hybrid ETF Tracker</h1>

      {usingBackup && (
        <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {sourceMessage}
          <div className="mt-1 text-amber-800">
            The tracker is currently in read-only backup mode, so account,
            order, and editing actions are hidden.
          </div>
        </div>
      )}

      {!usingBackup && <ProfilePanel />}
      {!usingBackup && (
        <CreateBundlePanel onRefresh={refreshPerformance} refreshing={updating} />
      )}

      {loading ? (
        <p className="text-gray-500">Loading bundles…</p>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Spot ETFs</h2>
            <BundleCardGrid bundles={SpotBundles} />
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Managed ETFs</h2>
            <BundleCardGrid bundles={ManagedBundles} />
          </section>
        </>
      )}
    </div>
  );
}
