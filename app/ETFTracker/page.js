"use client";

import { useState, useEffect } from "react";
import { supabase } from "../Lib/supabaseClient.js";
import Link from "next/link";

export default function Page() {
  const [bundles, setBundles] = useState([]);
  const [activeTab, setActiveTab] = useState("bundles");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBundles();
  }, []);

  async function fetchBundles() {
    setLoading(true);

    const { data, error } = await supabase
      .from('Soln0002 - Bundles')
      .select("id, name");

    if (error) {
      console.error("Error fetching bundles:", error);
      setBundles([]);
    } else {
      setBundles(data || []);
    }

    setLoading(false);
  }

  const renderBundles = () => {
    if (loading) return <p className="text-gray-500">Loading bundles...</p>;
    if (!bundles.length) return <p className="text-gray-500">No bundles found.</p>;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {bundles.map((bundle) => (
          <div
            key={bundle.id}
            className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition duration-200 border"
          >
            <h2 className="text-lg font-semibold mb-2">{bundle.name}</h2>

            {/* Show first 3 ticker symbols */}
            <div className="flex space-x-2 mb-3">
              {(bundle.assets || [])
                .slice(0, 3)
                .map((asset, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md"
                  >
                    {asset.symbol}
                  </span>
                ))}
            </div>

            {/* Performance */}
            <p
              className={`font-bold ${
                bundle.performance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {bundle.performance >= 0 ? "+" : ""}
              {bundle.performance?.toFixed(2)}%
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Hybrid ETF Tracker</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b pb-2 mb-4">
        <button
          onClick={() => setActiveTab("bundles")}
          className={`pb-1 ${
            activeTab === "bundles" ? "border-b-2 border-blue-500 text-blue-600" : ""
          }`}
        >
          My Bundles
        </button>
        <button
          onClick={() => setActiveTab("backtesting")}
          className={`pb-1 ${
            activeTab === "backtesting"
              ? "border-b-2 border-blue-500 text-blue-600"
              : ""
          }`}
        >
          Backtesting
        </button>
        <button
          onClick={() => setActiveTab("live")}
          className={`pb-1 ${
            activeTab === "live" ? "border-b-2 border-blue-500 text-blue-600" : ""
          }`}
        >
          Live Data
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "bundles" && renderBundles()}
      {activeTab === "backtesting" && (
        <div className="text-gray-600">Backtesting tools will go here.</div>
      )}
      {activeTab === "live" && (
        <div className="text-gray-600">Live performance data will go here.</div>
      )}
    </div>
  );
}
