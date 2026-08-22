import { type Cookies } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
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

export function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
	return bcrypt.compare(password, passwordHash);
}

/** Issues a session for a user: the table stores only the SHA-256 of the returned token. */
export async function createSession(userId: number): Promise<{ token: string; session: Session }> {
	const token = randomBytes(32).toString('base64url');
	const [row] = await db
		.insert(session)
		.values({
			id: createHash('sha256').update(token).digest('hex'),
			userId,
			expiresAt: new Date(Date.now() + ms({ days: 30 })),
		})
		.returning();

	return { token, session: row };
}

export function setSessionCookie(cookies: Cookies, token: string, expiresAt: Date): void {
	cookies.set('session', token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
	});
}
