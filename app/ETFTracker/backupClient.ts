type BackupAsset = {
  id: number;
  ticker: string;
  last_price_usd: number | null;
  last_trade_ts_ms: number | null;
};

type BackupBundleAsset = {
  assetId: number;
  linkId: number;
  ruleId: number | null;
  ticker: string;
  shares: number;
  inception_date: string | null;
  open_price_usd: number | null;
  last_price_usd: number | null;
  last_trade_ts_ms: number | null;
};

type BackupBundle = {
  id: number;
  name: string;
  bundle_type: "Spot" | "Managed";
  bundle_pl: number | null;
  last_updated_at: string | null;
  assets: BackupBundleAsset[];
};

type BackupData = {
  source: string;
  generated_at: string;
  bundles: BackupBundle[];
  assets: BackupAsset[];
  ohlcvByAsset: Record<string, [number, number, number, number, number, number, number][]>;
};

type Quote = {
  price: number | null;
  previousClose: number | null;
  currency: string | null;
};

let backupPromise: Promise<BackupData> | null = null;

export const BACKUP_MODE_MESSAGE =
  "Showing a local backup snapshot because Supabase is unavailable or not configured.";

async function fetchBackupData(): Promise<BackupData> {
  if (!backupPromise) {
    backupPromise = fetch("/ETFTracker/api/backup").then(async (res) => {
      if (!res.ok) {
        throw new Error(`Backup fetch failed (${res.status})`);
      }

      return (await res.json()) as BackupData;
    });
  }

  return backupPromise;
}

function buildQuoteMap(data: BackupData): Record<string, Quote> {
  const quoteMap: Record<string, Quote> = {};

  for (const asset of data.assets) {
    const bars = data.ohlcvByAsset[String(asset.id)] || [];
    const earliestBar = bars[0];

    quoteMap[asset.ticker.toUpperCase()] = {
      price: asset.last_price_usd ?? (bars.length ? bars[bars.length - 1][4] : null),
      previousClose: earliestBar ? earliestBar[1] : null,
      currency: "USD",
    };
  }

  return quoteMap;
}

export async function getBackupBundles() {
  const data = await fetchBackupData();

  return data.bundles.map((bundle) => ({
    id: bundle.id,
    name: bundle.name,
    bundle_type: bundle.bundle_type,
    bundle_pl: bundle.bundle_pl ?? null,
    assets: bundle.assets.map((asset) => ({
      id: asset.assetId,
      ticker: asset.ticker,
    })),
  }));
}

export async function getBackupBundleDetail(id: number) {
  const data = await fetchBackupData();
  const bundle = data.bundles.find((entry) => entry.id === id);

  if (!bundle) return null;

  return {
    bundle: {
      ...bundle,
      performance: bundle.bundle_pl ?? null,
      assets: bundle.assets.map((asset) => ({
        assetId: asset.assetId,
        linkId: asset.linkId,
        ruleId: asset.ruleId,
        ticker: asset.ticker,
        open_price_usd: asset.open_price_usd,
        inception_date: asset.inception_date ? new Date(asset.inception_date) : null,
        shares: asset.shares,
        limit_price: null,
      })),
    },
    quotes: buildQuoteMap(data),
    ruleOptions: [],
  };
}

export async function getBackupLiveBundle(id: number, rangeMin: number) {
  const data = await fetchBackupData();
  const bundle = data.bundles.find((entry) => entry.id === id);

  if (!bundle) return null;

  const assets = bundle.assets.map((asset) => ({
    id: asset.assetId,
    ticker: asset.ticker,
  }));

  const selectedSeries = bundle.assets.flatMap(
    (asset) => data.ohlcvByAsset[String(asset.assetId)] || []
  );
  const maxTimestamp = selectedSeries.length
    ? Math.max(...selectedSeries.map((row) => row[0]))
    : Date.now();
  const sinceMs = maxTimestamp - rangeMin * 60 * 1000;

  const barsByAsset: Record<number, any[]> = {};
  const lastByAsset: Record<number, any> = {};

  for (const asset of bundle.assets) {
    const bars = (data.ohlcvByAsset[String(asset.assetId)] || [])
      .filter((row) => row[0] >= sinceMs)
      .map((row) => ({
        asset_id: asset.assetId,
        bucket_start_ms: row[0],
        open: row[1],
        high: row[2],
        low: row[3],
        close: row[4],
        volume: row[5],
        trade_count: row[6],
      }));

    barsByAsset[asset.assetId] = bars;
    lastByAsset[asset.assetId] = {
      id: asset.assetId,
      ticker: asset.ticker,
      last_price_usd:
        asset.last_price_usd ?? (bars.length ? bars[bars.length - 1].close : null),
      last_trade_ts_ms:
        asset.last_trade_ts_ms ??
        (bars.length ? bars[bars.length - 1].bucket_start_ms : null),
    };
  }

  return {
    bundleName: bundle.name,
    assets,
    barsByAsset,
    lastByAsset,
  };
}
