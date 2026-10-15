import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{8,15}$/, 'Enter a valid phone / WhatsApp number'),
  category: z.string().trim().max(80).optional().default(''),
  design: z.string().trim().max(120).optional().default(''),
  event_date: z.string().trim().max(20).optional().default(''),
  location: z.string().trim().max(160).optional().default(''),
  time_pref: z.string().trim().max(60).optional().default(''),
  notes: z.string().trim().max(1000).optional().default(''),
  website: z.string().optional(), // honeypot
});
export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true }); // bot: silently accept
  db().prepare('INSERT INTO enquiries (name,phone,category,design,event_date,location,time_pref,notes) VALUES (?,?,?,?,?,?,?,?)')
    .run(d.name, d.phone, d.category, d.design, d.event_date, d.location, d.time_pref, d.notes);
  return NextResponse.json({ ok: true });
}
