import { char, integer, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user';

export const session = pgTable('session', {
	id: char('id', { length: 64 }).primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;
