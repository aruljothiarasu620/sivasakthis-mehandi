import Link from 'next/link';
import type { Metadata } from 'next';
import { getCategories, getSettings } from '@/lib/db';
export const metadata: Metadata = { title: 'About the Artist', description: 'Meet Sivasakthi – bridal and festive mehndi artist serving Pondicherry, Villupuram and Cuddalore.' };
export default function About() {
  const s = getSettings();
  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <p className="eyebrow">About</p>
      <h1 className="h-display mt-2 text-4xl md:text-5xl">{s.business_name}</h1>
      <div className="mt-10 grid items-start gap-10 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-3">
          {['m103', 'm186', 'm134', 'm051'].map((m) => <img key={m} src={`/portfolio/${m}-sm.webp`} alt="Mehndi by the artist" className="aspect-[3/4] w-full rounded-2xl object-cover" loading="lazy" />)}
        </div>
        <div className="space-y-5 leading-relaxed text-earth">
          <p className="whitespace-pre-line">{s.about}</p>
          <p><b className="text-maroon">Specialities:</b> {getCategories().map((c) => c.name).join(', ')}.</p>
          <p><b className="text-maroon">Serving:</b> {s.locations}.</p>
          <div className="flex flex-wrap gap-3">
            <a href={`https://instagram.com/${s.instagram_user}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">@{s.instagram_user}</a>
            <Link href="/contact" className="btn btn-primary">Book an Appointment</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
