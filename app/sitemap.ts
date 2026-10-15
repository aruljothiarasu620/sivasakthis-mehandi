import type { MetadataRoute } from 'next';
import { getDesigns } from '@/lib/db';
export const dynamic = 'force-dynamic';
export default function sitemap(): MetadataRoute.Sitemap {
  const b = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return [...['', '/designs', '/about', '/contact'].map((p) => ({ url: b + p })), ...getDesigns().map((d) => ({ url: `${b}/designs/${d.slug}` }))];
}
