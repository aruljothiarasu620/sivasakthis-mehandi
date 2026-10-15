import { Suspense } from 'react';
import type { Metadata } from 'next';
import DesignBrowser from '@/components/DesignBrowser';
import PriceNotice from '@/components/PriceNotice';
import { getCategories, getDesigns } from '@/lib/db';
export const metadata: Metadata = { title: 'Mehndi Designs – Bridal, Arabic, Engagement & More', description: 'Browse bridal, Arabic, engagement, traditional, minimal, baby shower and festival mehndi designs with prices. Serving Pondicherry, Villupuram and Cuddalore.' };
export default function Designs() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="eyebrow">Portfolio</p>
      <h1 className="h-display mt-2 mb-8 text-4xl md:text-5xl">Mehndi Designs</h1>
      <Suspense><DesignBrowser designs={getDesigns()} categories={getCategories()} /></Suspense>
      <PriceNotice />
    </div>
  );
}
