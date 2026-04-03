import { Schema } from 'effect'
import {
  UserId,
  FullName,
  UserRole,
  UserStatus,
  NotificationPreferences,
  Username,
  HashedPassword,
} from './entry'
import { AuditSchema, Timezone } from 'entities/common/entry'
import { Email } from 'entities/common/email'
import { PhoneNumber } from 'entities/common/phone.number'

/**
 * Effect Schema for the raw User data shape.
 *
 * Used at system boundaries (database reads, API payloads, domain events)
 * to parse and validate untrusted data before constructing a `User` aggregate.
 * Never use this schema deep inside domain logic — decode at the edges only.
 */
export const UserSchema = Schema.Struct({
  /** Unique identifier — UUID v4 */
  id: UserId,
  /** Unique login username — lowercase alphanumeric with underscores/hyphens */
  username: Username,
  /** Hashed password — never store plaintext */
  password: HashedPassword,
  /** Full name value object */
  name: FullName,
  /** Lowercase, validated email address */
  email: Email,
  /** Optional E.164-formatted phone number */
  phone: Schema.NullOr(PhoneNumber),
  /** Role governing access and feature visibility */
  role: UserRole,
  /** Current lifecycle status of the account */
  status: UserStatus,
  /** IANA timezone used for scheduling appointments in local time */
  timezone: Timezone,
  /** Optional public avatar URL (must be http/https) */
  avatarUrl: Schema.NullOr(Schema.String.pipe(Schema.pattern(/^https?:\/\//))),
  /** Whether the user has confirmed ownership of their email address */
  emailVerified: Schema.Boolean,
  /** Per-channel notification opt-in preferences */
  notificationPreferences: NotificationPreferences,
  /** Timestamp of the user's most recent successful login, or null if never logged in */
  lastLoginAt: Schema.NullOr(Schema.DateFromSelf),
  /** Human-readable reason provided when the account was suspended, or null */
  suspendedReason: Schema.NullOr(Schema.String),
  /** Shared audit trail fields (createdAt/By, updatedAt/By, deletedAt/By, isDeleted) */
  ...AuditSchema.fields,
})

/** Plain data type inferred from `UserSchema` — used internally by the aggregate. */
export type UserData = typeof UserSchema.Type
