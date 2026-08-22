import { sql, type SQL } from 'drizzle-orm';
import { date, integer, numeric, pgTable, serial, unique } from 'drizzle-orm/pg-core';
import { user } from './user';

export const entry = pgTable(
	'entry',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		date: date('date').notNull(),
		weight: numeric('weight', { precision: 5, scale: 2, mode: 'number' }).notNull(),
		consumed: integer('consumed').notNull(),
		// BMR + TEF + EAT + NEAT
		burned: integer('burned').notNull(),
		balance: integer('balance')
			.notNull()
			.generatedAlwaysAs((): SQL => sql`${entry.consumed} - ${entry.burned}`),
	},
	(t) => [unique('entry_user_date_unique').on(t.userId, t.date)],
);

export type Entry = typeof entry.$inferSelect;
export type NewEntry = typeof entry.$inferInsert;
