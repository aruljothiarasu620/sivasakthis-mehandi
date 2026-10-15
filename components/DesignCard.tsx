import Link from 'next/link';
import type { Design } from '@/lib/db';
import { priceLabel } from '@/lib/utils';
export default function DesignCard({ d, cat }: { d: Design; cat?: string }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-beige bg-white transition duration-500 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/designs/${d.slug}`} className="block aspect-[4/5] overflow-hidden bg-beige">
        <img src={d.thumb || d.image} alt={`${d.name}${cat ? ' – ' + cat : ''}`} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </Link>
      <div className="p-4">
        {cat && <p className="eyebrow !text-[10px]">{cat}</p>}
        <h3 className="mt-1 font-serif text-xl font-semibold text-maroon">{d.name}</h3>
        <p className="mt-1 text-sm font-medium text-earth">{priceLabel(d.price, d.starting)}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href={`/designs/${d.slug}`} className="btn btn-outline !px-3 !py-2 text-xs">View Details</Link>
          <Link href={`/contact?design=${d.slug}`} className="btn btn-primary !px-3 !py-2 text-xs">Book This Design</Link>
        </div>
      </div>
    </article>
  );
}
