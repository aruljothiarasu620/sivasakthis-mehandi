'use client';
import { useState } from 'react';
import { waLink } from '@/lib/utils';
type Props = { whatsapp: string; categories: string[]; designs: { slug: string; name: string }[]; initialDesign?: string; initialCategory?: string };
export default function EnquiryForm({ whatsapp, categories, designs, initialDesign = '', initialCategory = '' }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [error, setError] = useState('');
  const [wa, setWa] = useState('');
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(''); setState('loading');
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      const r = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Something went wrong');
      const msg = ['Hello! I would like to enquire about mehndi.', `Name: ${f.name}`, `Contact: ${f.phone}`, f.category && `Category: ${f.category}`, f.design && `Design: ${f.design}`,
        f.event_date && `Event date: ${f.event_date}`, f.location && `Location: ${f.location}`, f.time_pref && `Preferred time: ${f.time_pref}`, f.notes && `Notes: ${f.notes}`].filter(Boolean).join('\n');
      const link = waLink(whatsapp, msg); setWa(link); setState('done');
      window.open(link, '_blank', 'noopener');
    } catch (err) { setError((err as Error).message); setState('idle'); }
  }
  if (state === 'done') return (
    <div className="rounded-2xl border border-gold/40 bg-white p-8 text-center" role="status">
      <h3 className="font-serif text-2xl text-maroon">Thank you! Your enquiry is recorded.</h3>
      <p className="mt-3 text-sm text-earth">WhatsApp should have opened with your details. If not, tap below and press send.</p>
      <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-wa mt-5">Open WhatsApp</a>
      <p className="mt-5 text-xs text-earth">Submitting an enquiry does not confirm an appointment. Your booking is confirmed only after the artist replies.</p>
    </div>);
  const today = new Date().toISOString().slice(0, 10);
  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-beige bg-white p-6 md:p-8" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">Your name *<input name="name" required maxLength={80} className="field mt-1" autoComplete="name" /></label>
        <label className="text-sm">WhatsApp / contact number *<input name="phone" required inputMode="tel" className="field mt-1" autoComplete="tel" placeholder="98765 43210" /></label>
        <label className="text-sm">Preferred service category
          <select name="category" defaultValue={initialCategory} className="field mt-1"><option value="">Select…</option>{categories.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="text-sm">Selected design
          <input name="design" list="design-list" defaultValue={initialDesign} className="field mt-1" placeholder="Pick or type a design name" />
          <datalist id="design-list">{designs.map((d) => <option key={d.slug} value={d.name} />)}</datalist></label>
        <label className="text-sm">Event date<input type="date" name="event_date" min={today} className="field mt-1" /></label>
        <label className="text-sm">Preferred appointment time<input name="time_pref" className="field mt-1" placeholder="e.g. Evening before the event" /></label>
      </div>
      <label className="block text-sm">Event location (town / venue)<input name="location" maxLength={160} className="field mt-1" placeholder="Pondicherry, Villupuram, Cuddalore…" /></label>
      <label className="block text-sm">Additional requirements<textarea name="notes" rows={3} maxLength={1000} className="field mt-1" /></label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button disabled={state === 'loading'} className="btn btn-primary w-full">{state === 'loading' ? 'Sending…' : 'Send Enquiry via WhatsApp'}</button>
      <p className="text-xs text-earth">Submitting an enquiry does not automatically confirm an appointment. Your booking is confirmed only after the artist responds.</p>
    </form>
  );
}
