import { boolean, pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { businessesTable } from './business.table'
import { auditColumns } from './audit.columns'

export const dayOfWeekEnum = pgEnum('day_of_week', [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
])

export type WorkingHoursRow = typeof workingHoursTable.$inferSelect
export type WorkingHoursInsertRow = typeof workingHoursTable.$inferInsert

export const workingHoursTable = pgTable('working_hours', {
  /** UUID v4 primary key — matches domain WorkingHoursId */
  id: uuid('id').primaryKey(),

  /** FK → businesses.id — the business this schedule belongs to */
  businessId: uuid('business_id')
    .notNull()
    .references(() => businessesTable.id),

  /** Day of the week this record covers */
  dayOfWeek: dayOfWeekEnum('day_of_week').notNull(),

  /** Whether the business is open on this day */
  isOpen: boolean('is_open').notNull().default(false),

  /** Opening time in HH:MM (24h), null when isOpen is false */
  openTime: varchar('open_time', { length: 5 }),

  /** Closing time in HH:MM (24h), null when isOpen is false */
  closeTime: varchar('close_time', { length: 5 }),

  // ── Audit fields ────────────────────────────────────────────────────────
  ...auditColumns,
})
