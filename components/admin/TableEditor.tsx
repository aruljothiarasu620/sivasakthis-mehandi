'use client';
import { useCallback, useEffect, useState } from 'react';
import { api, upload } from './api';
export type Col = { key: string; label: string; type?: 'text' | 'number' | 'area' | 'check' | 'select' | 'image'; options?: { v: number | string; l: string }[]; wide?: boolean };
type Row = Record<string, any>;
export default function TableEditor({ table, cols, defaults = {}, title, hint, searchable }: { table: string; cols: Col[]; defaults?: Row; title: string; hint?: string; searchable?: boolean }) {
  const [rows, setRows] = useState<Row[]>([]); const [msg, setMsg] = useState(''); const [q, setQ] = useState(''); const [max, setMax] = useState(30);
  const load = useCallback(() => api<Row[]>(`/api/admin/${table}`).then(setRows).catch((e) => setMsg(e.message)), [table]);
  useEffect(() => { load(); }, [load]);
  const set = (id: number, k: string, v: any) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [k]: v, _dirty: true } : r)));
  const run = async (f: () => Promise<unknown>, ok: string) => { try { await f(); setMsg(ok); } catch (e) { setMsg('⚠ ' + (e as Error).message); } };
  const save = (r: Row) => run(async () => { const { _dirty, ...d } = r; await api(`/api/admin/${table}`, 'PATCH', d); setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, _dirty: false } : x))); }, 'Saved ✓');
  const del = (r: Row) => confirm('Delete this item permanently?') && run(async () => { await api(`/api/admin/${table}?id=${r.id}`, 'DELETE'); await load(); }, 'Deleted');
  const add = () => run(async () => { await api(`/api/admin/${table}`, 'POST', { name: 'New item', ...defaults }); await load(); setQ(''); }, 'Added – edit it below, then Save');
  const shown = rows.filter((r) => !q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));
  const sorted = rows.some((r) => r.id) && table === 'designs' ? shown : shown;
  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center gap-3"><h2 className="font-serif text-3xl text-maroon">{title}</h2>
        <button onClick={add} className="btn btn-primary !py-2">+ Add new</button>
        {searchable && <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter…" className="field !w-48 !py-2" />}
        <span role="status" className="text-sm text-earth">{msg}</span></div>
      {hint && <p className="mb-4 text-sm text-earth">{hint}</p>}
      <div className="space-y-4">
        {sorted.slice(0, max).map((r) => (
          <div key={r.id} className={`rounded-xl border bg-white p-4 ${r._dirty ? 'border-gold' : 'border-beige'}`}>
            <div className="grid gap-3 md:grid-cols-4">
              {cols.map((c) => (
                <label key={c.key} className={`text-xs ${c.wide || c.type === 'area' ? 'md:col-span-2' : ''}`}>{c.label}
                  {c.type === 'area' ? <textarea rows={2} value={r[c.key] ?? ''} onChange={(e) => set(r.id, c.key, e.target.value)} className="field mt-1" />
                  : c.type === 'check' ? <input type="checkbox" checked={!!r[c.key]} onChange={(e) => set(r.id, c.key, e.target.checked ? 1 : 0)} className="ml-2 h-4 w-4 align-middle" />
                  : c.type === 'select' ? <select value={r[c.key] ?? ''} onChange={(e) => set(r.id, c.key, Number(e.target.value))} className="field mt-1">{c.options?.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}</select>
                  : c.type === 'image' ? <div className="mt-1 flex items-center gap-2">{r[c.key] && <img src={r[c.key]} alt="" className="h-14 w-14 rounded object-cover" />}
                      <input type="file" accept="image/*" className="text-xs" onChange={async (e) => { const f = e.target.files?.[0]; if (f) await run(async () => { const u = await upload(f); set(r.id, c.key, u); if (c.key === 'image' && 'thumb' in r) set(r.id, 'thumb', u); }, 'Uploaded – press Save'); }} /></div>
                  : <input type={c.type === 'number' ? 'number' : 'text'} value={r[c.key] ?? ''} onChange={(e) => set(r.id, c.key, c.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)} className="field mt-1" />}
                </label>))}
            </div>
            <div className="mt-3 flex gap-2"><button onClick={() => save(r)} className="btn btn-gold !px-4 !py-1.5 text-xs">Save</button><button onClick={() => del(r)} className="btn btn-outline !px-4 !py-1.5 text-xs">Delete</button></div>
          </div>))}
      </div>
      {max < sorted.length && <button className="btn btn-outline mt-5" onClick={() => setMax(max + 30)}>Show more ({sorted.length - max})</button>}
    </section>
  );
}
