import crypto from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE = 'jasvir_admin_session';

function token(password: string) {
  return crypto.createHmac('sha256', password).update('jasvir-editor-admin').digest('hex');
}

const ALLOWED_PASSWORDS = ['jaspreet4465', 'rohit@..'];

function getPasswords(): string[] {
  const envPwd = process.env.ADMIN_PASSWORD?.trim();
  const list = envPwd ? [envPwd, ...ALLOWED_PASSWORDS] : ALLOWED_PASSWORDS;
  return Array.from(new Set(list.filter(Boolean)));
}

export function adminConfigured() {
  return getPasswords().length > 0;
}

export function validPassword(value: string) {
  const supplied = Buffer.from(value || '');
  return getPasswords().some(pwd => {
    const expected = Buffer.from(pwd);
    return supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
  });
}

export function sessionToken(pwd?: string) {
  const pass = pwd || getPasswords()[0];
  return token(pass);
}

export async function isAdmin() {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const supplied = Buffer.from(value);
  return getPasswords().some(pwd => {
    const expected = Buffer.from(token(pwd));
    return supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
  });
}

export function sessionCookie(pwd?: string) {
  return { name: COOKIE, value: sessionToken(pwd), httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 };
}

export { COOKIE };
