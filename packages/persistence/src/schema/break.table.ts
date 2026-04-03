import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { usersTable } from './user.table'
import { workingHoursTable } from './working.hours.table'

export type BreakRow = typeof breaksTable.$inferSelect
export type BreakInsertRow = typeof breaksTable.$inferInsert

export const breaksTable = pgTable('breaks', {
  id: uuid('id').primaryKey(),

  workingHoursId: uuid('working_hours_id')
    .notNull()
    .references(() => workingHoursTable.id),

  startTime: varchar('start_time', { length: 5 }).notNull(),

  endTime: varchar('end_time', { length: 5 }).notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  createdBy: uuid('created_by').references(() => usersTable.id),

  updatedAt: timestamp('updated_at').notNull().defaultNow(),

  updatedBy: uuid('updated_by').references(() => usersTable.id),

  deletedAt: timestamp('deleted_at'),

  deletedBy: uuid('deleted_by').references(() => usersTable.id),

  isDeleted: boolean('is_deleted').notNull().default(false),
})
