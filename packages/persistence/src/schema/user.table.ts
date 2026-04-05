import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { auditColumns } from './audit.columns'

export const userRoleEnum = pgEnum('user_role', [
  'superAdmin',
  'businessOwner',
  'locationOwner',
])

export const userStatusEnum = pgEnum('user_status', [
  'pending_verification',
  'active',
  'inactive',
  'suspended',
])

export type UserRow = typeof usersTable.$inferSelect
export type UserInsertRow = typeof usersTable.$inferInsert

export const usersTable = pgTable('users', {
  /** UUID v4 primary key — matches domain UserId */
  id: uuid('id').primaryKey(),

  /** Unique login identifier — lowercase alphanumeric, 3–30 chars */
  username: varchar('username', { length: 30 }).notNull().unique(),

  /** Argon2/bcrypt hashed password — never plaintext */
  password: varchar('password', { length: 255 }).notNull(),

  /** First name — max 50 chars */
  firstName: varchar('first_name', { length: 50 }).notNull(),

  /** Last name — max 50 chars */
  lastName: varchar('last_name', { length: 50 }).notNull(),

  /** Lowercase validated email address */
  email: varchar('email', { length: 255 }).notNull().unique(),

  /** E.164 phone number e.g. "+12025551234", nullable */
  phone: varchar('phone', { length: 16 }),

  /** Role governing access and feature visibility */
  role: userRoleEnum('role').notNull(),

  /** Current lifecycle status of the account */
  status: userStatusEnum('status').notNull().default('pending_verification'),

  /** IANA timezone identifier e.g. "America/New_York" */
  timezone: varchar('timezone', { length: 100 }).notNull(),

  /** Optional public avatar URL */
  avatarUrl: text('avatar_url'),

  /** Whether the user has confirmed ownership of their email */
  emailVerified: boolean('email_verified').notNull().default(false),

  /** Per-channel notification opt-ins: { email, sms, push } */
  notificationPreferences: jsonb('notification_preferences')
    .$type<{ email: boolean; sms: boolean; push: boolean }>()
    .notNull()
    .default({ email: true, sms: false, push: true }),

  /** Timestamp of the user's most recent successful login, null if never */
  lastLoginAt: timestamp('last_login_at'),

  /** Human-readable reason provided when the account was suspended */
  suspendedReason: text('suspended_reason'),

  // ── Audit fields ────────────────────────────────────────────────────────
  ...auditColumns,
})
