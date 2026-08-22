import { json, type RequestHandler } from '@sveltejs/kit';
import { user, type NewUser } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { parseDBError } from '$lib/server/db/errorHandler';
import { createSession, hashPassword, setSessionCookie } from '../utils';

function isBodyValid(body: unknown) {
	if (typeof body !== 'object' || body === null) return false;

	const emailPattern = /^(?!.{255})[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[a-z]{2,}$/i;
	const minPasswordLength = 8;
	// bcrypt silently truncates anything past 72 bytes.
	const maxPasswordBytes = 72;

	const { email, password, age } = body as Record<string, unknown>;
	return (
		typeof email === 'string' &&
		emailPattern.test(email.trim()) &&
		typeof password === 'string' &&
		password.length >= minPasswordLength &&
		Buffer.byteLength(password) <= maxPasswordBytes &&
		typeof age === 'number' &&
		Number.isInteger(age) &&
		age > 0
	);
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json().catch(() => null);
	if (!isBodyValid(body)) {
		return json(
			{ message: 'a valid email, password (8+ characters, 72 bytes max) and age are required' },
			{ status: 400 },
		);
	}

	const values: NewUser = {
		email: body.email.trim().toLowerCase(),
		passwordHash: await hashPassword(body.password),
		age: body.age,
	};

	try {
		const [created] = await db
			.insert(user)
			.values(values)
			.returning({ id: user.id, email: user.email, age: user.age });

		const { token, session } = await createSession(created.id);
		setSessionCookie(cookies, token, session.expiresAt);

		return json({ user: created }, { status: 201 });
	} catch (error) {
		const { status, ...dbError } = parseDBError(error);
		return json(dbError, { status });
	}
};
