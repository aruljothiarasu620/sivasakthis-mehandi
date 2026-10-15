'use client';
import { useEffect, useState } from 'react';
import { api } from './api';
import { inr, waLink } from '@/lib/utils';
type E = { id: number; name: string; phone: string; category: string; design: string; event_date: string; location: string; time_pref: string; notes: string; status: string; quote_price: number | ''; quote_notes: string; created_at: string };
const STATUSES = ['new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled'];
export default function Enquiries({ businessName }: { businessName: string }) {
  const [rows, setRows] = useState<E[]>([]); const [msg, setMsg] = useState('');
  useEffect(() => { api<E[]>('/api/admin/enquiries').then(setRows); }, []);
  const set = (id: number, k: keyof E, v: string | number) => setRows((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)));
  async function save(e: E) { try { await api('/api/admin/enquiries', 'PATCH', { id: e.id, status: e.status, quote_price: e.quote_price, quote_notes: e.quote_notes }); setMsg('Saved ✓'); } catch (x) { setMsg('⚠ ' + (x as Error).message); } }
  const quoteLink = (e: E) => waLink(e.phone, `Hello ${e.name}, thank you for your enquiry with ${businessName}.\n${e.design ? 'Design: ' + e.design + '\n' : ''}${e.event_date ? 'Event date: ' + e.event_date + '\n' : ''}Your personalised quote: ${e.quote_price ? inr(Number(e.quote_price)) : '—'}${e.quote_notes ? '\nNotes: ' + e.quote_notes : ''}\nPlease reply to confirm your booking.`);
  return (
    <section><h2 className="mb-4 font-serif text-3xl text-maroon">Enquiries <span role="status" className="ml-3 font-sans text-sm text-earth">{msg}</span></h2>
      <p className="mb-4 text-sm text-earth">Private – never shown on the public site. Enter a custom quote, save, then send it to the customer on WhatsApp.</p>
      {rows.length === 0 && <p className="text-earth">No enquiries yet.</p>}
      <div className="space-y-4">{rows.map((e) => (
        <div key={e.id} className="rounded-xl border border-beige bg-white p-4 text-sm">
          <div className="flex flex-wrap justify-between gap-2"><b className="text-maroon">{e.name} · {e.phone}</b><span className="text-xs text-earth">{e.created_at}</span></div>
          <p className="mt-1 text-earth">{[e.category, e.design, e.event_date && 'Date: ' + e.event_date, e.location, e.time_pref].filter(Boolean).join(' · ')}</p>
          {e.notes && <p className="mt-1">“{e.notes}”</p>}
          <div className="mt-3 grid gap-3 md:grid-cols-4">
            <label className="text-xs">Status<select value={e.status} onChange={(x) => set(e.id, 'status', x.target.value)} className="field mt-1">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
            <label className="text-xs">Custom quote (₹)<input type="number" value={e.quote_price ?? ''} onChange={(x) => set(e.id, 'quote_price', x.target.value === '' ? '' : Number(x.target.value))} className="field mt-1" /></label>
            <label className="text-xs md:col-span-2">Notes for customer<input value={e.quote_notes ?? ''} onChange={(x) => set(e.id, 'quote_notes', x.target.value)} className="field mt-1" /></label>
          </div>
          <div className="mt-3 flex flex-wrap gap-2"><button onClick={() => save(e)} className="btn btn-gold !px-4 !py-1.5 text-xs">Save</button>
            <a href={quoteLink(e)} target="_blank" rel="noopener noreferrer" className="btn btn-wa !px-4 !py-1.5 text-xs">Send quote on WhatsApp</a>
            <button onClick={async () => { if (confirm('Delete this enquiry?')) { await api(`/api/admin/enquiries?id=${e.id}`, 'DELETE'); setRows((r) => r.filter((x) => x.id !== e.id)); } }} className="btn btn-outline !px-4 !py-1.5 text-xs">Delete</button></div>
        </div>))}</div>
    </section>
  );
}
