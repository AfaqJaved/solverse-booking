import { pgEnum, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core'
import { usersTable } from './user.table'
import { auditColumns } from './audit.columns'

export const businessStatusEnum = pgEnum('business_status', [
  'pending_verification',
  'active',
  'inactive',
  'suspended',
])

export const businessPlanEnum = pgEnum('business_plan', [
  'free',
  'starter',
  'pro',
  'enterprise',
])

export type BusinessRow = typeof businessesTable.$inferSelect
export type BusinessInsertRow = typeof businessesTable.$inferInsert

export const businessesTable = pgTable('businesses', {
  /** UUID v4 primary key — matches domain BusinessId */
  id: uuid('id').primaryKey(),

  /** FK → users.id — the businessOwner who created this business */
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => usersTable.id),

  /** Public display name — 2–100 chars */
  name: varchar('name', { length: 100 }).notNull(),

  /** URL-safe slug used in booking links: /<slug>/book — globally unique */
  slug: varchar('slug', { length: 50 }).notNull().unique(),

  /** Primary contact email for the business */
  email: varchar('email', { length: 255 }).notNull(),

  /** E.164 phone number e.g. "+12025551234", nullable */
  phone: varchar('phone', { length: 16 }),

  /** IANA timezone identifier e.g. "America/New_York" */
  timezone: varchar('timezone', { length: 100 }).notNull(),

  /** Current lifecycle status of the business */
  status: businessStatusEnum('status')
    .notNull()
    .default('pending_verification'),

  /** Subscription plan governing feature access and usage limits */
  plan: businessPlanEnum('plan').notNull().default('free'),

  /** ISO 4217 currency code used for all services (e.g. "USD", "EUR") */
  currency: varchar('currency', { length: 3 }).notNull(),

  /** Optional public logo URL */
  logoUrl: text('logo_url'),

  /** Optional short description shown on the public booking page — max 500 chars */
  description: varchar('description', { length: 500 }),

  /** Optional business website URL */
  website: text('website'),

  /** Human-readable reason provided when the business was suspended */
  suspendedReason: text('suspended_reason'),

  // ── Audit fields ────────────────────────────────────────────────────────
  ...auditColumns,
})
