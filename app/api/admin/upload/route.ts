import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { DATA_DIR } from '@/lib/db';
const TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
export async function POST(req: NextRequest) {
  const file = (await req.formData()).get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file' }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return NextResponse.json({ error: 'Only JPG, PNG or WebP images are allowed' }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: 'Image must be under 8 MB' }, { status: 400 });
  const name = crypto.randomBytes(8).toString('hex') + '.' + ext;
  await fs.mkdir(path.join(DATA_DIR, 'uploads'), { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, 'uploads', name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: '/media/' + name });
}
