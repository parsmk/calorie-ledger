import { json, type RequestHandler } from '@sveltejs/kit';
import { parseDBError } from '$lib/server/db/errorHandler';
import { clearSessionCookie, deleteSession, sessionCookieName } from '../utils';

export const POST: RequestHandler = async ({ cookies }) => {
	const token = cookies.get(sessionCookieName);

	// Cleared before the row is revoked: a database failure must not leave the client holding a
	// cookie it believes is still signed in.
	clearSessionCookie(cookies);

	try {
		if (token) await deleteSession(token);
	} catch (error) {
		const { status, ...dbError } = parseDBError(error);
		return json(dbError, { status });
	}

	return new Response(null, { status: 204 });
};
