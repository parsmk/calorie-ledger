import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { user } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { parseDBError } from '$lib/server/db/errorHandler';
import { createSession, setSessionCookie, testEmail, verifyPassword } from '../utils';

function isBodyValid(body: unknown) {
	if (typeof body !== 'object' || body === null) return false;

	const { email, password } = body as Record<string, unknown>;
	return (
		typeof email === 'string' &&
		testEmail(email) &&
		typeof password === 'string' &&
		password.length > 0
	);
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json().catch(() => null);
	if (!isBodyValid(body)) {
		return json({ message: 'a valid email and password are required' }, { status: 400 });
	}

	try {
		const [found] = await db
			.select()
			.from(user)
			.where(eq(user.email, body.email.trim().toLowerCase()))
			.limit(1);

		if (!found || !(await verifyPassword(body.password, found.passwordHash))) {
			return json({ message: 'invalid email or password' }, { status: 401 });
		}

		const { token, session } = await createSession(found.id);
		setSessionCookie(cookies, token, session.expiresAt);

		return json({ user: { id: found.id, email: found.email, age: found.age } });
	} catch (error) {
		const { status, ...dbError } = parseDBError(error);
		return json(dbError, { status });
	}
};
