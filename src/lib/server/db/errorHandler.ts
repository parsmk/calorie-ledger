import postgres from 'postgres';

export interface DBError {
	status: number;
	message: string;
	constraint: string | null;
}

// Defines the shape of the error handler functions
type ErrorHandler = (error: postgres.PostgresError) => DBError;

// Maps PostgreSQL error codes to specific handler functions
const PostgresErrorHandlers: Record<string, ErrorHandler> = {
	'23505': (error) => ({
		status: 409,
		message: 'A duplicate entry was found for a unique field.',
		constraint: error.constraint_name ?? null,
	}),
	'23503': (error) => ({
		status: 409,
		message: 'A foreign key violation occurred. The record you are trying to link does not exist.',
		constraint: error.constraint_name ?? null,
	}),
	'22P02': () => ({
		status: 400,
		message: 'The data provided is in an invalid format (e.g., not a valid UUID).',
		constraint: null,
	}),
	'23514': (error) => ({
		status: 400,
		message: 'A check constraint was violated.',
		constraint: error.constraint_name ?? null,
	}),
	'23502': (error) => ({
		status: 400,
		message: `A required field is missing. The column '${error.column_name}' cannot be null.`,
		constraint: error.column_name ?? null,
	}),
	'42703': (error) => ({
		status: 500,
		message: 'An undefined column was referenced in the query.',
		constraint: error.column_name ?? null,
	}),
	'42601': () => ({
		status: 500,
		message: "There's a syntax error in the database query.",
		constraint: null,
	}),
	'25000': () => ({
		status: 500,
		message: 'Transaction failed: a data integrity issue occurred within a database transaction.',
		constraint: null,
	}),
	'08006': () => ({
		status: 503,
		message: 'Database connection failed. The database may be unavailable.',
		constraint: null,
	}),
	'42P01': () => ({
		status: 500,
		message: 'A referenced table does not exist in the database.',
		constraint: null,
	}),
	'40001': () => ({
		status: 409,
		message:
			'Transaction serialization failure. Please retry the transaction as it could not be completed due to concurrent modifications.',
		constraint: null,
	}),
	default: (error) => ({
		status: 500,
		message: `A database error occurred: ${error.message}`,
		constraint: null,
	}),
};

/** Drizzle wraps driver errors, and not always at a fixed depth, so the chain is walked. */
function findPostgresError(error: unknown) {
	for (let cause = error, depth = 0; cause !== null && depth < 8; depth++) {
		if (cause instanceof postgres.PostgresError) return cause;
		if (typeof cause !== 'object') return undefined;
		cause = 'cause' in cause ? cause.cause : null;
	}

	return undefined;
}

export function parseDBError(error: unknown): DBError {
	const postgresError = findPostgresError(error);
	if (postgresError) {
		const handler = PostgresErrorHandlers[postgresError.code] ?? PostgresErrorHandlers.default;
		return handler(postgresError);
	}

	// A non-driver error carries the query and its parameters in the message, so it is logged
	// rather than returned to the caller.
	console.error(error);
	return { status: 500, message: 'An unexpected error occurred.', constraint: null };
}
