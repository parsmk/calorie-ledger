import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { user, type NewUser } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { parseDBError } from '$lib/server/db/errorHandler';
import { createSession, hashPassword, setSessionCookie, testEmail } from '../utils';

function isBodyValid(body: unknown) {
	if (typeof body !== 'object' || body === null) return false;

	const minPasswordLength = 8;
	// bcrypt silently truncates anything past 72 bytes.
	const maxPasswordBytes = 72;
	// The columns are 4-byte ints, so an unbounded age or height reaches the driver as a 500.
	const maxAge = 120;
	const maxHeight = 300;

	const { email, password, age, height } = body as Record<string, unknown>;
	return (
		typeof email === 'string' &&
		testEmail(email) &&
		typeof password === 'string' &&
		password.length >= minPasswordLength &&
		Buffer.byteLength(password) <= maxPasswordBytes &&
		typeof age === 'number' &&
		Number.isInteger(age) &&
		age > 0 &&
		age <= maxAge &&
		typeof height === 'number' &&
		Number.isInteger(height) &&
		height > 0 &&
		height <= maxHeight
	);
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json().catch(() => null);
	if (!isBodyValid(body)) {
		return json(
			{
				message:
					'a valid email, password (8+ characters, 72 bytes max), age (1-120) ' +
					'and height in cm (1-300) are required',
			},
			{ status: 400 },
		);
	}

	const values: NewUser = {
		email: body.email.trim().toLowerCase(),
		passwordHash: await hashPassword(body.password),
		age: body.age,
		height: body.height,
	};

	try {
		const [created] = await db
			.insert(user)
			.values(values)
			.returning({ id: user.id, email: user.email, age: user.age, height: user.height });

		const { token, session } = await createSession(created.id);
		setSessionCookie(cookies, token, session.expiresAt);

		return json({ user: created }, { status: 201 });
	} catch (error) {
		const { status, ...dbError } = parseDBError(error);
		return json(dbError, { status });
	}
};

/**
 * Whether an email is still free, so the signup form can settle the credentials step before asking
 * for anything else. It answers the same question a duplicate `POST` already answers with its 409.
 */
export const GET: RequestHandler = async ({ url }) => {
	const email = url.searchParams.get('email');
	if (email === null || !testEmail(email)) {
		return json({ message: 'a valid email is required' }, { status: 400 });
	}

	try {
		const [found] = await db
			.select({ id: user.id })
			.from(user)
			.where(eq(user.email, email.trim().toLowerCase()))
			.limit(1);

		return json({ available: !found });
	} catch (error) {
		const { status, ...dbError } = parseDBError(error);
		return json(dbError, { status });
	}
};
