import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const limits = { image: { maxBytes: 15 * 1024 * 1024, extensions: ['.jpg', '.jpeg', '.png', '.webp'] }, video: { maxBytes: 250 * 1024 * 1024, extensions: ['.mp4', '.webm', '.mov'] } } as const;
function safeName(name: string) { const extension = path.extname(name).toLowerCase(); const base = path.basename(name, extension).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'upload'; return `${base}-${randomUUID().slice(0, 8)}${extension}`; }
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Admin sign-in required.' }, { status: 401 });
  const form = await request.formData().catch(() => null); const file = form?.get('file'); const kind = form?.get('kind') === 'video' ? 'video' : 'image';
  if (!(file instanceof File) || !file.size) return NextResponse.json({ error: 'Choose a file to upload.' }, { status: 400 });
  const extension = path.extname(file.name).toLowerCase(); const policy = limits[kind];
  if (!policy.extensions.includes(extension as never)) return NextResponse.json({ error: `Unsupported ${kind} format.` }, { status: 415 });
  if (file.size > policy.maxBytes) return NextResponse.json({ error: `${kind === 'video' ? 'Video' : 'Image'} is too large.` }, { status: 413 });
  const filename = safeName(file.name); const directory = path.join(process.cwd(), 'public', 'work');
  await mkdir(directory, { recursive: true }); await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()), { flag: 'wx' });
  return NextResponse.json({ path: `/work/${filename}`, filename });
}
