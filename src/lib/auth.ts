/**
 * POSTs a JSON body to one of the `/api/auth` routes. Resolves to `null` when the route accepted
 * it, otherwise to the message it replied with — which is what the form puts in front of the user.
 */
export async function postAuth(path: string, body: unknown): Promise<string | null> {
	let response: Response;
	try {
		response = await fetch(path, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),
		});
	} catch {
		return 'could not reach the server, please try again';
	}

	if (response.ok) return null;

	const payload: unknown = await response.json().catch(() => null);
	const message = (payload as { message?: unknown } | null)?.message;

	return typeof message === 'string' ? message : 'something went wrong, please try again';
}
