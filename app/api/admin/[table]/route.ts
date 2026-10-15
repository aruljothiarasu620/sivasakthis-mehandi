import { NextRequest, NextResponse } from 'next/server';
import { db, rowOp, TABLES, TableName } from '@/lib/db';
import { slugify } from '@/lib/utils';
const ok = (t: string): t is TableName => t in TABLES;
type Ctx = { params: { table: string } };
export async function GET(_: NextRequest, { params }: Ctx) {
  if (!ok(params.table)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const order = params.table === 'enquiries' ? 'id DESC' : params.table === 'designs' ? 'id DESC' : 'sort,id';
  return NextResponse.json(db().prepare(`SELECT * FROM ${params.table} ORDER BY ${order}`).all());
}
export async function POST(req: NextRequest, { params }: Ctx) {
  if (!ok(params.table) || params.table === 'enquiries') return NextResponse.json({ error: 'Not allowed' }, { status: 405 });
  const body = await req.json();
  if ('slug' in body === false && TABLES[params.table].includes('slug' as never)) body.slug = '';
  if ('slug' in body) body.slug = slugify(body.slug || body.name || 'item') + (body.slug ? '' : '-' + Date.now().toString(36));
  try { return NextResponse.json({ id: rowOp(params.table, 'insert', body) }); }
  catch (e) { return NextResponse.json({ error: String((e as Error).message) }, { status: 400 }); }
}
export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!ok(params.table)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const { id, ...data } = await req.json();
  if ('slug' in data) data.slug = slugify(String(data.slug));
  try { rowOp(params.table, 'update', data, Number(id)); return NextResponse.json({ ok: true }); }
  catch (e) { return NextResponse.json({ error: String((e as Error).message) }, { status: 400 }); }
}
export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!ok(params.table)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const id = Number(req.nextUrl.searchParams.get('id'));
  db().prepare(`DELETE FROM ${params.table} WHERE id=?`).run(id);
  return NextResponse.json({ ok: true });
}
