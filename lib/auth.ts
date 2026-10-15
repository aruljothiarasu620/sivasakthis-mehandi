import { SignJWT, jwtVerify } from 'jose';
const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-only-secret-change-me-please-32chars');
export const COOKIE = 'admin_session';
export const sign = () => new SignJWT({ role: 'admin' }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(secret());
export async function valid(token?: string) {
  if (!token) return false;
  try { await jwtVerify(token, secret()); return true; } catch { return false; }
}
