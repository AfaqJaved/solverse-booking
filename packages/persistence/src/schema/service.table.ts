import { integer, pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { usersTable } from './user.table'
import { businessesTable } from './business.table'
import { auditColumns } from './audit.columns'

export const serviceStatusEnum = pgEnum('service_status', [
  'active',
  'inactive',
])

export type ServiceRow = typeof servicesTable.$inferSelect
export type ServiceInsertRow = typeof servicesTable.$inferInsert

export const servicesTable = pgTable('services', {
  /** UUID v4 primary key — matches domain ServiceId */
  id: uuid('id').primaryKey(),

  /** FK → businesses.id — the business that offers this service */
  businessId: uuid('business_id')
    .notNull()
    .references(() => businessesTable.id),

  /** Display name shown to customers on the booking page */
  name: varchar('name', { length: 100 }).notNull(),

  /** Optional description of what the service includes — max 500 chars */
  description: varchar('description', { length: 500 }),

  /** Duration of the service in minutes (5–480) — shown to customers */
  duration: integer('duration').notNull(),

  /** Buffer time in minutes added after the appointment — invisible to customers */
  bufferTime: integer('buffer_time').notNull().default(0),

  /** Price in the smallest currency unit (e.g. cents for USD) — 0 for free */
  price: integer('price').notNull(),

  /** Current visibility and bookability status */
  status: serviceStatusEnum('status').notNull().default('active'),

  /** Optional hex color for calendar display e.g. "#FF5733" */
  color: varchar('color', { length: 7 }),

  /** Maximum concurrent bookings allowed for the same time slot */
  maxBookingsPerSlot: integer('max_bookings_per_slot').notNull().default(1),

  // ── Audit fields ────────────────────────────────────────────────────────
  ...auditColumns,
})
