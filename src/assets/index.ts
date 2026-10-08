import catalog from './catalog.json';
import responsiveCatalog from './responsive-catalog.json';

type AssetRecord = {
  url: string;
  kind: string;
  sourceUrl: string;
  dimensions: { width?: number; height?: number; duration?: number } | null;
};
const records = catalog as Record<string, AssetRecord>;
type ResponsiveVariant = 'phone' | 'tablet' | 'desktop' | 'xxl';
const responsiveRecords = responsiveCatalog as Record<string, Partial<Record<ResponsiveVariant, string>>>;
const sourceIds = new Map(Object.entries(records).filter(([, record]) => !record.sourceUrl.startsWith('https://neiden.framer.media')).map(([id, record]) => [record.sourceUrl, id]));

export function asset(id: string): AssetRecord {
  const record = records[id];
  if (!record) throw new Error(`Unknown archived asset: ${id}`);
  return record;
}

export function assetUrl(idOrSource: string): string {
  if (idOrSource in records) return records[idOrSource].url;
  const id = sourceIds.get(idOrSource);
  if (id) return records[id].url;
  throw new Error(`Unknown archived source: ${idOrSource}`);
}

/** Exact negotiated bitmap when the measured source variant is archived. */
export function responsiveAssetUrl(id: string, variant: ResponsiveVariant): string {
  return responsiveRecords[id]?.[variant] ?? assetUrl(id);
}
