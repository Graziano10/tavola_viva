import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getEnv } from '@/lib/env';

const encoder = new TextEncoder();
const cookieName = 'tv_admin_session';

function getSecret() {
  return encoder.encode(getEnv().NEXTAUTH_SECRET);
}

type SessionPayload = {
  sub: string;
  role: 'ADMIN';
};

export async function verifyAdminCredentials(email: string, password: string) {
  const emailMatches = email.toLowerCase() === getEnv().ADMIN_EMAIL.toLowerCase();
  const passwordMatches = await bcrypt.compare(password, await hashConfiguredAdminPassword());
  return emailMatches && passwordMatches;
}

let hashedPasswordPromise: Promise<string> | null = null;
async function hashConfiguredAdminPassword() {
  if (!hashedPasswordPromise) {
    hashedPasswordPromise = bcrypt.hash(getEnv().ADMIN_PASSWORD, 10);
  }
  return hashedPasswordPromise;
}

export async function createAdminSession(email: string) {
  return new SignJWT({ role: 'ADMIN' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(getSecret());
}

export async function setAdminSession(email: string) {
  const token = await createAdminSession(email);
  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== 'ADMIN' || typeof payload.sub !== 'string') {
      return null;
    }

    return {
      sub: payload.sub,
      role: 'ADMIN',
    };
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  return session;
}
