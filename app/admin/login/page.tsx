'use client';
import { useState } from 'react';
export default function Login() {
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr('');
    const r = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: new FormData(e.currentTarget).get('password') }) });
    if (r.ok) location.href = '/admin'; else { setErr((await r.json()).error); setBusy(false); }
  }
  return (
    <form onSubmit={go} className="mx-auto mt-20 max-w-sm space-y-4 rounded-2xl border border-beige bg-white p-8">
      <h1 className="font-serif text-3xl text-maroon">Admin Login</h1>
      <input type="password" name="password" required autoFocus className="field" placeholder="Password" aria-label="Password" />
      {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
      <button className="btn btn-primary w-full" disabled={busy}>{busy ? 'Checking…' : 'Sign in'}</button>
    </form>
  );
}
