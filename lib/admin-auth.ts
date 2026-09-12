import crypto from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE = 'jasvir_admin_session';

function token(password: string) {
  return crypto.createHmac('sha256', password).update('jasvir-editor-admin').digest('hex');
}

const DEFAULT_PASSWORD = 'rohit@..';

function getPassword() {
  return process.env.ADMIN_PASSWORD?.trim() || DEFAULT_PASSWORD;
}

export function adminConfigured() {
  return Boolean(getPassword());
}

export function validPassword(value: string) {
  const password = getPassword();
  const supplied = Buffer.from(value || '');
  const expected = Buffer.from(password || '');
  return Boolean(password && supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected));
}

export function sessionToken() {
  const password = getPassword();
  return password ? token(password) : '';
}

export async function isAdmin() {
  const password = getPassword();
  const value = (await cookies()).get(COOKIE)?.value;
  const supplied = Buffer.from(value || '');
  const expected = Buffer.from(password ? token(password) : '');
  return Boolean(password && supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected));
}

export function sessionCookie() {
  return { name: COOKIE, value: sessionToken(), httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 };
}

export { COOKIE };
