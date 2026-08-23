import { findSession, sessionCookieName } from './api/auth/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get(sessionCookieName);

	// Only whether a live session backs the cookie — the token itself never reaches the client.
	return { activeSession: token !== undefined && (await findSession(token)) !== undefined };
};
