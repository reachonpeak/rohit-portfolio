import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { readProjects, writeProjects } from '@/lib/project-store';
import type { Project } from '@/lib/portfolio-data';

export const dynamic = 'force-dynamic';
const categories = ['Brand stories', 'Social & ads', 'Automotive', 'Spaces & places', 'Food & wellness'] as const;
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET() {
  return NextResponse.json(await readProjects(), { headers: { 'Cache-Control': 'no-store' } });
}

function clean(value: unknown, max: number) { return typeof value === 'string' ? value.trim().slice(0, max) : ''; }

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Admin sign-in required.' }, { status: 401 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const id = clean(body?.id, 80).toLowerCase();
  const project: Project = {
    id, brand: clean(body?.brand, 100), title: clean(body?.title, 140),
    category: clean(body?.category, 40) as Project['category'], format: body?.format === 'landscape' ? 'landscape' : undefined,
    duration: clean(body?.duration, 8), description: clean(body?.description, 900),
    details: Array.isArray(body?.details) ? body.details.map(item => clean(item, 80)).filter(Boolean).slice(0, 5) : [],
    color: clean(body?.color, 20) || '#b9c99a',
    image: clean(body?.image, 500) || undefined,
    video: clean(body?.video, 500) || undefined,
  };
  if (!idPattern.test(id) || !project.brand || !project.title || !categories.includes(project.category) || !/^\d{2}:\d{2}$/.test(project.duration) || !project.description) {
    return NextResponse.json({ error: 'Enter an id, brand, title, category, mm:ss duration, and description.' }, { status: 400 });
  }
  const current = await readProjects();
  const index = current.findIndex(item => item.id === id);
  if (index >= 0) current[index] = project; else current.push(project);
  await writeProjects(current);
  return NextResponse.json(project, { status: index >= 0 ? 200 : 201 });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Admin sign-in required.' }, { status: 401 });
  const id = clean(new URL(request.url).searchParams.get('id'), 80);
  const current = await readProjects();
  const next = current.filter(item => item.id !== id);
  if (next.length === current.length) return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
  await writeProjects(next);
  return NextResponse.json({ ok: true });
}
