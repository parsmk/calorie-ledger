import { type Cookies } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { createHash, randomBytes } from 'node:crypto';
import { db } from '$lib/server/db';
import { session, type Session } from '$lib/server/db/schema';

export interface Duration {
	weeks?: number;
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
	milliseconds?: number;
}

const msPerUnit: Record<keyof Duration, number> = {
	weeks: 1000 * 60 * 60 * 24 * 7,
	days: 1000 * 60 * 60 * 24,
	hours: 1000 * 60 * 60,
	minutes: 1000 * 60,
	seconds: 1000,
	milliseconds: 1,
};

/** Milliseconds in a duration given as named units: `ms({ days: 2, minutes: 30 })`. */
export function ms(duration: Duration): number {
	let total = 0;
	for (const unit of Object.keys(msPerUnit) as (keyof Duration)[]) {
		total += (duration[unit] ?? 0) * msPerUnit[unit];
	}

	return total;
}

const emailPattern = /^(?!.{255})[^\s@.]+(?:\.[^\s@.]+)*@[^\s@.]+(?:\.[^\s@.]+)*\.[a-z]{2,}$/i;

export function testEmail(email: string): boolean {
	return emailPattern.test(email.trim());
}

export function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
	return bcrypt.compare(password, passwordHash);
}

export const sessionCookieName = 'session';

function hashToken(token: string): string {
	return createHash('sha256').update(token).digest('hex');
}

/** Issues a session for a user: the table stores only the SHA-256 of the returned token. */
export async function createSession(userId: number): Promise<{ token: string; session: Session }> {
	const token = randomBytes(32).toString('base64url');
	const [row] = await db
		.insert(session)
		.values({
			id: hashToken(token),
			userId,
			expiresAt: new Date(Date.now() + ms({ days: 30 })),
		})
		.returning();

	return { token, session: row };
}

/** Revokes a single session. Returns whether the token matched a live row. */
export async function deleteSession(token: string): Promise<boolean> {
	const deleted = await db.delete(session).where(eq(session.id, hashToken(token))).returning();

	return deleted.length > 0;
}

export function setSessionCookie(cookies: Cookies, token: string, expiresAt: Date): void {
	cookies.set(sessionCookieName, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
	});
}

export function clearSessionCookie(cookies: Cookies): void {
	cookies.delete(sessionCookieName, { path: '/' });
}
