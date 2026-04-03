import {
  boolean,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { usersTable } from './user.table'
import { businessesTable } from './business.table'

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

  /** Timestamp when the record was first created */
  createdAt: timestamp('created_at').notNull().defaultNow(),

  /** FK → users.id — actor who created the record */
  createdBy: uuid('created_by').references(() => usersTable.id),

  /** Timestamp of the most recent update to any field */
  updatedAt: timestamp('updated_at').notNull().defaultNow(),

  /** FK → users.id — actor who last updated the record */
  updatedBy: uuid('updated_by').references(() => usersTable.id),

  /** Timestamp when the record was soft-deleted, null if not deleted */
  deletedAt: timestamp('deleted_at'),

  /** FK → users.id — actor who soft-deleted the record */
  deletedBy: uuid('deleted_by').references(() => usersTable.id),

  /** Whether the record has been soft-deleted */
  isDeleted: boolean('is_deleted').notNull().default(false),
})
