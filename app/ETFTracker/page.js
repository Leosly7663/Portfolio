"use client";

import { useState, useEffect } from "react";
import { supabase } from "../Lib/supabaseClient";
import Link from "next/link";

export default function BundlesPage() {
  const [liveBundles, setLiveBundles] = useState([]);
  const [demoBundles, setDemoBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBundles();
  }, []);

  async function fetchBundles() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Soln0002 - Bundles")
      .select(`
        id,
        name,
        type,          
        bundle_PL,
        assets:"Soln0002 - Assets to Bundles" (
          asset:"Soln0002 - Assets" (
            id,
            ticker
          )
        )
      `);

    if (error) {
      console.error(error);
      setLiveBundles([]);
      setDemoBundles([]);
    } else {
      const formatted = data.map((bundle) => ({
        ...bundle,
        assets: bundle.assets?.map((a) => a.asset) || [],
      }));

      setLiveBundles(formatted.filter((b) => b.type === "Live"));
      setDemoBundles(formatted.filter((b) => b.type === "Demo"));
    }
    setLoading(false);
  }

  function renderBundleCard(bundle) {
    return (
      <Link key={bundle.id} href={`/ETFTracker/${bundle.id}`}>
        <div className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition duration-200 border cursor-pointer">
          <h2 className="text-lg font-semibold mb-2">{bundle.name}</h2>
          <div className="flex space-x-2 mb-3">
            {bundle.assets.slice(0, 3).map((asset, id) => (
              <span
                key={id}
                className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md"
              >
                {asset.ticker}
              </span>
            ))}
          </div>
          <p
            className={`font-bold ${
              bundle.bundle_PL >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {bundle.bundle_PL >= 0 ? "+" : ""}
            {bundle.bundle_PL?.toFixed(2)}%
          </p>
        </div>
      </Link>
    );
  }

  if (loading) return <p className="text-gray-500">Loading bundles...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Hybrid ETF Tracker</h1>

      {/* Live ETFs */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Live ETFs</h2>
        {liveBundles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveBundles.map(renderBundleCard)}
          </div>
        ) : (
          <p className="text-gray-500">No live ETFs available.</p>
        )}
      </section>

      {/* Demo ETFs */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Demo ETFs</h2>
        {demoBundles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoBundles.map(renderBundleCard)}
          </div>
        ) : (
          <p className="text-gray-500">No demo ETFs available.</p>
        )}
      </section>
    </div>
  );
}
