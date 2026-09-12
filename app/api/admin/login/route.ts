import { NextResponse } from 'next/server';
import { adminConfigured, sessionCookie, validPassword } from '@/lib/admin-auth';

export async function POST(request: Request) {
  if (!adminConfigured()) return NextResponse.json({ error: 'Admin password is not configured on this server.' }, { status: 503 });
  const body = await request.json().catch(() => null) as { password?: string } | null;
  const password = body?.password || '';
  if (!validPassword(password)) return NextResponse.json({ error: 'Incorrect admin password.' }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookie(password));
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('jasvir_admin_session');
  return response;
}
