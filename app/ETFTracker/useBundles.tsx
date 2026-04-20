import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../Lib/supabase/supabaseClient";
import { recomputeBundles } from "./apiClient";
import { BACKUP_MODE_MESSAGE, getBackupBundles } from "./backupClient";

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
  const [usingBackup, setUsingBackup] = useState(false);
  const [sourceMessage, setSourceMessage] = useState<string | null>(null);

  const loadBackup = useCallback(async (message = BACKUP_MODE_MESSAGE) => {
    const bundles = (await getBackupBundles()) as BundleRow[];
    setSpotBundles(bundles.filter((bundle) => bundle.bundle_type === "Spot"));
    setManagedBundles(bundles.filter((bundle) => bundle.bundle_type === "Managed"));
    setUsingBackup(true);
    setSourceMessage(message);
  }, []);

  const fetchBundles = useCallback(async () => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured || !supabase) {
        await loadBackup(
          "Supabase configuration is missing. Showing the bundled backup snapshot."
        );
        return;
      }

      const { data, error } = await supabase
        .from("Soln0002 - Bundles")
        .select(
          `id, name, bundle_type, bundle_pl, assets:"Soln0002 - Assets to Bundles"(asset:"Soln0002 - Assets"(id, ticker))`
        );

      if (error) {
        console.error(error);
        await loadBackup();
        return;
      }

      const formatted = (data || []).map((bundle: any) => ({
        id: bundle.id,
        name: bundle.name,
        bundle_type: bundle.bundle_type,
        bundle_pl: bundle.bundle_pl ?? null,
        assets: (bundle.assets || []).map((asset: any) => asset.asset).filter(Boolean),
      })) as BundleRow[];

      setSpotBundles(formatted.filter((bundle) => bundle.bundle_type === "Spot"));
      setManagedBundles(
        formatted.filter((bundle) => bundle.bundle_type === "Managed")
      );
      setUsingBackup(false);
      setSourceMessage(null);
    } catch (error) {
      console.error(error);
      await loadBackup();
    } finally {
      setLoading(false);
    }
  }, [loadBackup]);

  useEffect(() => {
    fetchBundles();
  }, [fetchBundles]);

  const refreshPerformance = useCallback(async () => {
    if (usingBackup) {
      await fetchBundles();
      return;
    }

    try {
      setUpdating(true);
      await recomputeBundles();
      await fetchBundles();
    } finally {
      setUpdating(false);
    }
  }, [fetchBundles, usingBackup]);

  return {
    SpotBundles,
    ManagedBundles,
    loading,
    refreshPerformance,
    updating,
    usingBackup,
    sourceMessage,
  };
}
