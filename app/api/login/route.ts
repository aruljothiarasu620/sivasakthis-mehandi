import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { COOKIE, sign } from '@/lib/auth';
const tries = new Map<string, { n: number; t: number }>();
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  const rec = tries.get(ip);
  if (rec && rec.n >= 5 && Date.now() - rec.t < 15 * 60_000) return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  const { password } = await req.json().catch(() => ({ password: '' }));
  const real = process.env.ADMIN_PASSWORD;
  const a = crypto.createHash('sha256').update(String(password)).digest();
  const b = crypto.createHash('sha256').update(real || '').digest();
  if (!real || !crypto.timingSafeEqual(a, b)) {
    tries.set(ip, { n: (rec?.n || 0) + 1, t: Date.now() });
    return NextResponse.json({ error: real ? 'Incorrect password' : 'ADMIN_PASSWORD is not set on the server' }, { status: 401 });
  }
  tries.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await sign(), { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 604800 });
  return res;
}
