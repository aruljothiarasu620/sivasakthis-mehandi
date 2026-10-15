import fs from 'fs/promises';
import path from 'path';
import { DATA_DIR } from '@/lib/db';
const MIME: Record<string, string> = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
export async function GET(_: Request, { params }: { params: { file: string } }) {
  const f = path.basename(params.file); const ext = f.split('.').pop() || '';
  if (!MIME[ext]) return new Response('Not found', { status: 404 });
  try {
    const buf = await fs.readFile(path.join(DATA_DIR, 'uploads', f));
    return new Response(buf, { headers: { 'Content-Type': MIME[ext], 'Cache-Control': 'public, max-age=31536000, immutable' } });
  } catch { return new Response('Not found', { status: 404 }); }
}
