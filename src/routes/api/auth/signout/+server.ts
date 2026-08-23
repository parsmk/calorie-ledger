import { json, type RequestHandler } from '@sveltejs/kit';
import { parseDBError } from '$lib/server/db/errorHandler';
import { clearSessionCookie, deleteSession, sessionCookieName } from '../utils';

export const POST: RequestHandler = async ({ cookies }) => {
	const token = cookies.get(sessionCookieName);

	try {
		if (token) await deleteSession(token);
	} catch (error) {
		const { status, ...dbError } = parseDBError(error);
		return json(dbError, { status });
	}

	clearSessionCookie(cookies);

	return new Response(null, { status: 204 });
};
