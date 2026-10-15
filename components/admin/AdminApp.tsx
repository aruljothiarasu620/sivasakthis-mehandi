'use client';
import { useEffect, useState } from 'react';
import TableEditor from './TableEditor';
import Enquiries from './Enquiries';
import SettingsForm from './SettingsForm';
import { api } from './api';
const TABS = ['Enquiries', 'Designs', 'Categories', 'Packages & Prices', 'Testimonials', 'Settings'];
export default function AdminApp() {
  const [tab, setTab] = useState(TABS[0]);
  const [cats, setCats] = useState<{ id: number; name: string }[]>([]);
  const [biz, setBiz] = useState('');
  useEffect(() => { api<typeof cats>('/api/admin/categories').then(setCats); api<Record<string, string>>('/api/admin/settings').then((s) => setBiz(s.business_name)); }, [tab]);
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-6 flex items-center justify-between"><h1 className="font-serif text-4xl text-maroon">Dashboard</h1>
        <button className="btn btn-outline !py-2" onClick={async () => { await api('/api/logout', 'POST'); location.href = '/admin/login'; }}>Log out</button></div>
      <div className="mb-8 flex flex-wrap gap-2" role="tablist">{TABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`rounded-full border px-4 py-2 text-sm ${tab === t ? 'border-maroon bg-maroon text-cream' : 'border-gold/40'}`}>{t}</button>)}</div>
      {tab === 'Enquiries' && <Enquiries businessName={biz} />}
      {tab === 'Designs' && <TableEditor key="d" table="designs" title="Designs" searchable hint="Price 0 = “Custom quote”. Tick “Starting price” to show “From ₹…”. Tick “Featured” to show on the homepage. Extra photos: comma-separated image URLs."
        defaults={{ category_id: cats[0]?.id, price: 0, starting: 1 }}
        cols={[{ key: 'name', label: 'Name' }, { key: 'category_id', label: 'Category', type: 'select', options: cats.map((c) => ({ v: c.id, l: c.name })) }, { key: 'price', label: 'Price (₹)', type: 'number' }, { key: 'starting', label: 'Starting price', type: 'check' },
          { key: 'featured', label: 'Featured', type: 'check' }, { key: 'duration', label: 'Application time (optional)' }, { key: 'image', label: 'Photo', type: 'image' }, { key: 'description', label: 'Description', type: 'area' }, { key: 'extra_images', label: 'Extra photo URLs', wide: true }]} />}
      {tab === 'Categories' && <TableEditor key="c" table="categories" title="Categories" cols={[{ key: 'name', label: 'Name' }, { key: 'sort', label: 'Order', type: 'number' }, { key: 'cover', label: 'Cover photo', type: 'image' }, { key: 'description', label: 'Description', type: 'area' }]} defaults={{ sort: 99 }} />}
      {tab === 'Packages & Prices' && <TableEditor key="p" table="packages" title="Packages" cols={[{ key: 'name', label: 'Name' }, { key: 'price', label: 'Price (₹, 0 = custom quote)', type: 'number' }, { key: 'starting', label: 'Starting price', type: 'check' }, { key: 'sort', label: 'Order', type: 'number' }, { key: 'description', label: 'Description', type: 'area' }, { key: 'features', label: 'Features (one per line)', type: 'area' }]} defaults={{ price: 0, sort: 99 }} />}
      {tab === 'Testimonials' && <TableEditor key="t" table="testimonials" title="Testimonials" hint="Add genuine client reviews only (with permission). The section stays hidden while empty." cols={[{ key: 'name', label: 'Client name' }, { key: 'location', label: 'Town' }, { key: 'sort', label: 'Order', type: 'number' }, { key: 'text', label: 'Review', type: 'area' }]} defaults={{ text: '' }} />}
      {tab === 'Settings' && <SettingsForm />}
    </div>
  );
}
