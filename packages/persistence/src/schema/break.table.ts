import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { workingHoursTable } from './working.hours.table'
import { auditColumns } from './audit.columns'

export type BreakRow = typeof breaksTable.$inferSelect
export type BreakInsertRow = typeof breaksTable.$inferInsert

export const breaksTable = pgTable('breaks', {
  /** UUID v4 primary key */
  id: uuid('id').primaryKey(),

  /** FK → working_hours.id — the working hours slot this break belongs to */
  workingHoursId: uuid('working_hours_id')
    .notNull()
    .references(() => workingHoursTable.id),

  /** Human-readable label e.g. "Lunch break" */
  label: varchar('label', { length: 100 }).notNull(),

  /** Break start time in HH:MM (24h) */
  startTime: varchar('start_time', { length: 5 }).notNull(),

  /** Break end time in HH:MM (24h) */
  endTime: varchar('end_time', { length: 5 }).notNull(),

  // ── Audit fields ────────────────────────────────────────────────────────
  ...auditColumns,
})
