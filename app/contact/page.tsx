import type { Metadata } from 'next';
import EnquiryForm from '@/components/EnquiryForm';
import { getCategories, getDesigns, getSettings } from '@/lib/db';
import { waLink } from '@/lib/utils';
export const metadata: Metadata = { title: 'Book Mehndi – Contact', description: 'Enquire or book mehndi in Pondicherry, Villupuram and Cuddalore via WhatsApp.' };
export default function Contact({ searchParams }: { searchParams: { design?: string; package?: string } }) {
  const s = getSettings(), cats = getCategories(), designs = getDesigns();
  const picked = designs.find((d) => d.slug === searchParams.design);
  const pickedCat = cats.find((c) => c.id === picked?.category_id)?.name;
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="eyebrow">Contact</p>
      <h1 className="h-display mt-2 text-4xl md:text-5xl">Book Your Mehndi</h1>
      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <aside className="space-y-4 text-sm">
          <a href={waLink(s.whatsapp, 'Hi! I would like to enquire about mehndi.')} target="_blank" rel="noopener noreferrer" className="btn btn-wa w-full">Chat on WhatsApp</a>
          <a href={`https://instagram.com/${s.instagram_user}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full">Instagram @{s.instagram_user}</a>
          <a href={`tel:${s.phone.replace(/\s/g, '')}`} className="btn btn-outline w-full">Call {s.phone}</a>
          <div className="rounded-2xl border border-beige bg-white p-5"><p className="eyebrow mb-2">Service locations</p><p>{s.locations}</p>
            <p className="eyebrow mb-2 mt-4">Business hours</p><p>{s.hours}</p></div>
        </aside>
        <EnquiryForm whatsapp={s.whatsapp} categories={cats.map((c) => c.name)} designs={designs.map((d) => ({ slug: d.slug, name: d.name }))}
          initialDesign={picked?.name || searchParams.package || ''} initialCategory={pickedCat || ''} />
      </div>
    </div>
  );
}
