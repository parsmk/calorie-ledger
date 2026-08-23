/**
 * What a call to `/api/auth` produced: either the parsed body, or the message to put in front of
 * the user. Kept as one object rather than destructured fields so that checking `error` narrows
 * `data` to non-null.
 */
export type AuthResult<T> = { data: T; error: null } | { data: null; error: string };

async function send<T>(path: string, init?: RequestInit): Promise<AuthResult<T>> {
	let response: Response;
	try {
		response = await fetch(path, init);
	} catch {
		return { data: null, error: 'could not reach the server, please try again' };
	}

	const payload: unknown = await response.json().catch(() => null);

	if (!response.ok) {
		const message = (payload as { message?: unknown } | null)?.message;
		return {
			data: null,
			error: typeof message === 'string' ? message : 'something went wrong, please try again',
		};
	}

	return { data: payload as T, error: null };
}

export function postAuth<T = unknown>(path: string, body: unknown): Promise<AuthResult<T>> {
	return send<T>(path, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body),
	});
}

export function getAuth<T = unknown>(
	path: string,
	params: Record<string, string>,
): Promise<AuthResult<T>> {
	return send<T>(`${path}?${new URLSearchParams(params)}`);
}
