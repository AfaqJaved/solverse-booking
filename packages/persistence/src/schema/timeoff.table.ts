import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  boolean,
  date,
} from 'drizzle-orm/pg-core'
import { businessesTable } from './business.table'
import { auditColumns } from './audit.columns'

export const timeoffCadenceEnum = pgEnum('timeoff_cadence', [
  'once',
  'daily',
  'weekly',
  'monthly',
  'yearly',
])

export const timeoffStatusEnum = pgEnum('timeoff_status', [
  'active',
  'cancelled',
])

export type TimeOffRow = typeof timeoffsTable.$inferSelect
export type TimeOffInsertRow = typeof timeoffsTable.$inferInsert

export const timeoffsTable = pgTable('timeoffs', {
  /** UUID v4 primary key — matches domain TimeOffId */
  id: uuid('id').primaryKey(),

  /** FK → businesses.id — the business that is closed during this time off */
  businessId: uuid('business_id')
    .notNull()
    .references(() => businessesTable.id),

  /** Descriptive label for the time off (1-200 chars) */
  label: varchar('label', { length: 200 }).notNull(),

  /** Whether the time off is for the entire day */
  allDay: boolean('all_day').notNull().default(false),

  /** How the time off repeats */
  cadence: timeoffCadenceEnum('cadence').notNull().default('once'),

  /** Current status of the time off */
  status: timeoffStatusEnum('status').notNull().default('active'),

  /** Start date of the time off period (inclusive) */
  startDate: date('start_date', { mode: 'date' }).notNull(),

  /** End date of the time off period (inclusive) */
  endDate: date('end_date', { mode: 'date' }).notNull(),

  /** Start time of day (HH:MM in 24h format), null when allDay is true */
  startTime: varchar('start_time', { length: 5 }),

  /** End time of day (HH:MM in 24h format), null when allDay is true */
  endTime: varchar('end_time', { length: 5 }),

  // ── Audit fields ────────────────────────────────────────────────────────
  ...auditColumns,
})
