"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../Lib/supabaseClient";
import { LockClosedIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

export default function BundleDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [bundle, setBundle] = useState(null);
  const [activeTab, setActiveTab] = useState("live");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; 
    fetchBundle();
  }, [id]);

  async function fetchBundle() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Soln0002 - Bundles")
      .select(`
        id,
        name,
        type,
        performance:bundle_PL,
        assets:"Soln0002 - Assets to Bundles" (
          asset:"Soln0002 - Assets" (
            id,
            ticker
          )
        )
      `)
      .eq("id", Number(id))
      .single();

    if (error) {
      console.error(error);
      setBundle(null);
    } else {
      setBundle({
        ...data,
        assets: data.assets?.map(a => a.asset) || []
      });
    }

    setLoading(false);
  }

  if (loading) return <p className="text-gray-500">Loading bundle...</p>;
  if (!bundle) return <p className="text-gray-500">Bundle not found.</p>;

  const isDemo = bundle.type === "Demo";

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mb-4 px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
      >
        ← Back
      </button>

      {/* Title and Type Badge */}
      <div className="flex items-center space-x-3 mb-2">
        <h1 className="text-2xl font-bold">{bundle.name}</h1>
        {isDemo ? (
          <span className="flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-md">
            <PencilSquareIcon className="w-4 h-4 mr-1" />
            Editable – Can Backtest
          </span>
        ) : (
          <span className="flex items-center px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-md">
            <LockClosedIcon className="w-4 h-4 mr-1" />
            Fixed Contents – Cannot Edit
          </span>
        )}
      </div>

      {/* Asset tags */}
      <div className="flex space-x-2 mb-4">
        {bundle.assets.map((asset) => (
          <span
            key={asset.id}
            className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md"
          >
            {asset.ticker}
          </span>
        ))}
      </div>

      {/* Performance */}
      <p
        className={`font-bold mb-4 ${
          bundle.performance >= 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {bundle.performance >= 0 ? "+" : ""}
        {bundle.performance?.toFixed(2)}%
      </p>

      {/* Tabs */}
      <div className="flex space-x-4 border-b pb-2 mb-4">
        <button
          onClick={() => setActiveTab("live")}
          className={`pb-1 ${
            activeTab === "live" ? "border-b-2 border-blue-500 text-blue-600" : ""
          }`}
        >
          Live Performance
        </button>

        {/* Show backtesting tab only for Demo */}
        {isDemo && (
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
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "live" && (
        <div className="text-gray-600">
          Live performance charts will go here.
        </div>
      )}
      {activeTab === "backtesting" && isDemo && (
        <div className="text-gray-600">
          Backtesting tools & bundle editing will go here.
          {/* Example edit button */}
          <button className="mt-4 px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
            Edit Bundle
          </button>
        </div>
      )}
    </div>
  );
}
