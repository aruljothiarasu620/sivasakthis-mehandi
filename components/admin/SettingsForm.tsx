'use client';
import { useEffect, useState } from 'react';
import { api } from './api';
const FIELDS: [string, string, boolean?][] = [
  ['business_name', 'Business name'], ['tagline', 'Homepage headline'], ['intro', 'Short intro', true],
  ['whatsapp', 'WhatsApp number with country code (e.g. 919876543210)'], ['phone', 'Display phone number'],
  ['instagram_user', 'Instagram username (no @)'], ['instagram_followers', 'Instagram followers text (e.g. 15K+)'],
  ['locations', 'Service locations (comma separated)'], ['hours', 'Business hours'], ['about', 'About the artist (experience, style…)', true]];
export default function SettingsForm() {
  const [s, setS] = useState<Record<string, string>>({}); const [msg, setMsg] = useState('');
  useEffect(() => { api<Record<string, string>>('/api/admin/settings').then(setS); }, []);
  const placeholder = s.whatsapp === '910000000000';
  return (
    <section><h2 className="mb-4 font-serif text-3xl text-maroon">Site Settings</h2>
      {placeholder && <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">⚠ The WhatsApp number is still a placeholder. Enter the artist&apos;s real number before launch.</p>}
      <div className="grid gap-4 md:grid-cols-2">{FIELDS.map(([k, l, area]) => (
        <label key={k} className={`text-xs ${area ? 'md:col-span-2' : ''}`}>{l}
          {area ? <textarea rows={3} value={s[k] ?? ''} onChange={(e) => setS({ ...s, [k]: e.target.value })} className="field mt-1" />
            : <input value={s[k] ?? ''} onChange={(e) => setS({ ...s, [k]: e.target.value })} className="field mt-1" />}</label>))}</div>
      <button className="btn btn-primary mt-5" onClick={async () => { try { await api('/api/admin/settings', 'PUT', s); setMsg('Saved ✓'); } catch (e) { setMsg('⚠ ' + (e as Error).message); } }}>Save settings</button> <span role="status" className="text-sm">{msg}</span>
    </section>
  );
}
