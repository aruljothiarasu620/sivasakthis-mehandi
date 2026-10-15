import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import DesignCard from '@/components/DesignCard';
import PriceNotice from '@/components/PriceNotice';
import { getCategories, getDesign, getDesigns, getSettings } from '@/lib/db';
import { priceLabel, waLink } from '@/lib/utils';
type P = { params: { slug: string } };
export function generateMetadata({ params }: P): Metadata {
  const d = getDesign(params.slug); if (!d) return {};
  return { title: d.name, description: d.description, openGraph: { images: [d.image] } };
}
export default function DesignPage({ params }: P) {
  const d = getDesign(params.slug); if (!d) notFound();
  const s = getSettings(), cat = getCategories().find((c) => c.id === d.category_id);
  const related = getDesigns().filter((x) => x.category_id === d.category_id && x.id !== d.id).slice(0, 4);
  const imgs = [d.image, ...d.extra_images.split(',').map((x) => x.trim()).filter(Boolean)];
  const msg = `Hi! I'm interested in "${d.name}" (${cat?.name}). Could you share availability and a quote?\n${process.env.NEXT_PUBLIC_SITE_URL || ''}/designs/${d.slug}`;
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <nav className="mb-6 text-sm text-earth"><Link href="/designs">Designs</Link> / {cat && <Link href={`/designs?cat=${cat.slug}`}>{cat.name}</Link>}</nav>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4">{imgs.map((src, i) => <img key={src} src={src} alt={`${d.name} – photo ${i + 1}`} className="w-full rounded-2xl border border-beige" fetchPriority={i ? 'low' : 'high'} />)}</div>
        <div className="md:sticky md:top-24 md:self-start">
          <p className="eyebrow">{cat?.name}</p>
          <h1 className="h-display mt-2 text-4xl">{d.name}</h1>
          <p className="mt-4 text-3xl font-semibold text-gold">{priceLabel(d.price, d.starting)}</p>
          <p className="mt-5 leading-relaxed text-earth">{d.description}</p>
          {d.duration && <p className="mt-4 text-sm"><b>Estimated application time:</b> {d.duration}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={waLink(s.whatsapp, msg)} target="_blank" rel="noopener noreferrer" className="btn btn-wa">Book on WhatsApp</a>
            <Link href={`/contact?design=${d.slug}`} className="btn btn-primary">Send Enquiry</Link>
          </div>
          <PriceNotice />
        </div>
      </div>
      {related.length > 0 && <section className="mt-20"><h2 className="h-display mb-6 text-3xl">Related Designs</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{related.map((r) => <DesignCard key={r.id} d={r} cat={cat?.name} />)}</div></section>}
    </div>
  );
}
