import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../Lib/supabase/supabaseClient";
import { recomputeBundles } from "./api/apiClient/route";

export type BundleRow = {
  id: number;
  name: string;
  bundle_type: "Spot" | "Managed";
  bundle_pl: number | null;
  assets: { id: number; ticker: string }[];
};

export function useBundles() {
  const [SpotBundles, setSpotBundles] = useState<BundleRow[]>([]);
  const [ManagedBundles, setManagedBundles] = useState<BundleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchBundles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Soln0002 - Bundles")
      .select(
        `id, name, type, bundle_pl, assets:"Soln0002 - Assets to Bundles"(asset:"Soln0002 - Assets"(id, ticker))`
      );

    if (error) {
      console.error(error);
      setSpotBundles([]);
      setManagedBundles([]);
    } else {
      const formatted = (data || []).map((b: any) => ({
        id: b.id,
        name: b.name,
        bundle_type: b.bundle_type,
        bundle_pl: b.bundle_pl ?? null,
        assets: (b.assets || []).map((a: any) => a.asset).filter(Boolean),
      })) as BundleRow[];
      setSpotBundles(formatted.filter((b) => b.bundle_type === "Spot"));
      setManagedBundles(formatted.filter((b) => b.bundle_type === "Managed"));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBundles();
  }, [fetchBundles]);

  const refreshPerformance = useCallback(async () => {
    try {
      setUpdating(true);
      await recomputeBundles();
      await fetchBundles();
    } finally {
      setUpdating(false);
    }
  }, [fetchBundles]);

  return { SpotBundles, ManagedBundles, loading, refreshPerformance, updating };
}