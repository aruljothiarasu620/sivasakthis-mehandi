'use client';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DesignCard from './DesignCard';
import type { Category, Design } from '@/lib/db';
const PAGE = 24;
export default function DesignBrowser({ designs, categories }: { designs: Design[]; categories: Category[] }) {
  const sp = useSearchParams();
  const [cat, setCat] = useState(sp.get('cat') || 'all');
  const [q, setQ] = useState('');
  const [max, setMax] = useState(PAGE);
  const byId = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);
  const active = categories.find((c) => c.slug === cat);
  const list = useMemo(() => designs.filter((d) =>
    (cat === 'all' || byId[d.category_id]?.slug === cat) &&
    (!q || (d.name + ' ' + d.description).toLowerCase().includes(q.toLowerCase()))), [designs, cat, q, byId]);
  const pick = (s: string) => { setCat(s); setMax(PAGE); };
  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Categories">
        {[{ slug: 'all', name: 'All Designs' }, ...categories].map((c) => (
          <button key={c.slug} role="tab" aria-selected={cat === c.slug} onClick={() => pick(c.slug)}
            className={`rounded-full border px-4 py-2 text-sm transition ${cat === c.slug ? 'border-maroon bg-maroon text-cream' : 'border-gold/40 hover:border-maroon'}`}>{c.name}</button>
        ))}
      </div>
      {active && <p className="mb-6 max-w-2xl text-earth">{active.description}</p>}
      <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setMax(PAGE); }} placeholder="Search designs (e.g. peacock, bridal, feet)…" aria-label="Search designs" className="field mb-8 max-w-md" />
      {list.length === 0 ? <p className="py-16 text-center text-earth">No designs found. Try another category or search — or ask for a custom design!</p> : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {list.slice(0, max).map((d) => <DesignCard key={d.id} d={d} cat={byId[d.category_id]?.name} />)}
        </div>)}
      {max < list.length && <div className="mt-10 text-center"><button className="btn btn-outline" onClick={() => setMax(max + PAGE)}>Show more ({list.length - max} left)</button></div>}
      <p className="mt-10 text-center text-xs text-earth">{`Showing ${Math.min(max, list.length)} of ${list.length} designs`}</p>
    </div>
  );
}
