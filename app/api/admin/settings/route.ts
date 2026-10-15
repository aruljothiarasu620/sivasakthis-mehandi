export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db, getSettings } from '@/lib/db';
export const GET = async () => NextResponse.json(getSettings());
export async function PUT(req: NextRequest) {
  const body = (await req.json()) as Record<string, string>;
  const st = db().prepare('INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value');
  db().transaction(() => { for (const [k, v] of Object.entries(body)) st.run(k.slice(0, 40), String(v).slice(0, 4000)); })();
  return NextResponse.json({ ok: true });
}
