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
import { AuditSchema } from '../common/entry'
import { UserEmail } from './value-objects/email'
import { UserPhoneNumber } from './value-objects/phone.number'
import { UserTimezone } from './value-objects/timezone'

/**
 * Effect Schema for the raw User data shape.
 *
 * Used at system boundaries (database reads, API payloads, domain events)
 * to parse and validate untrusted data before constructing a `User` aggregate.
 * Never use this schema deep inside domain logic — decode at the edges only.
 */
export const UserSchema = Schema.Struct({
  /** Unique identifier — UUID v4 */
  id: UserId.annotations({
    message: () =>
      '@Solverse/User: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
  }),
  /** Unique login username — lowercase alphanumeric with underscores/hyphens */
  username: Username.annotations({
    message: () =>
      '@Solverse/User: username must be 3–30 lowercase alphanumeric characters; underscores or hyphens allowed but not at start or end (e.g. "john_doe")',
  }),
  /** Hashed password — never store plaintext */
  password: HashedPassword.annotations({
    message: () =>
      '@Solverse/User: password must be a non-empty hashed password string (bcrypt/argon2)',
  }),
  /** Full name value object */
  name: FullName.annotations({
    message: () =>
      '@Solverse/User: name must be an object with non-empty firstName and lastName (max 50 characters each)',
  }),
  /** Lowercase, validated email address */
  email: UserEmail,
  /** Optional E.164-formatted phone number */
  phone: Schema.NullOr(UserPhoneNumber).annotations({
    message: () =>
      '@Solverse/User: phone must be null or a valid E.164 phone number (e.g. "+12025551234")',
  }),
  /** Role governing access and feature visibility */
  role: UserRole.annotations({
    message: () =>
      '@Solverse/User: role must be one of "superAdmin", "businessOwner", or "locationOwner"',
  }),
  /** Current lifecycle status of the account */
  status: UserStatus.annotations({
    message: () =>
      '@Solverse/User: status must be one of "pending_verification", "active", "inactive", or "suspended"',
  }),
  /** IANA timezone used for scheduling appointments in local time */
  timezone: UserTimezone.annotations({
    message: () =>
      '@Solverse/User: timezone must be a valid IANA timezone identifier (e.g. "America/New_York")',
  }),
  /** Optional public avatar URL (must be http/https) */
  avatarUrl: Schema.NullOr(
    Schema.String.pipe(Schema.pattern(/^https?:\/\//)),
  ).annotations({
    message: () =>
      '@Solverse/User: avatarUrl must be null or a valid http/https URL',
  }),
  /** Whether the user has confirmed ownership of their email address */
  emailVerified: Schema.Boolean.annotations({
    message: () => '@Solverse/User: emailVerified must be a boolean',
  }),
  /** Per-channel notification opt-in preferences */
  notificationPreferences: NotificationPreferences.annotations({
    message: () =>
      '@Solverse/User: notificationPreferences must be an object with boolean fields: email, sms, and push',
  }),
  /** Timestamp of the user's most recent successful login, or null if never logged in */
  lastLoginAt: Schema.NullOr(Schema.DateFromSelf).annotations({
    message: () =>
      '@Solverse/User: lastLoginAt must be null or a valid Date instance',
  }),
  /** Human-readable reason provided when the account was suspended, or null */
  suspendedReason: Schema.NullOr(Schema.String).annotations({
    message: () => '@Solverse/User: suspendedReason must be null or a string',
  }),
  /** Timestamp when the record was first created */
  createdAt: AuditSchema.fields.createdAt.annotations({
    message: () => '@Solverse/User: createdAt must be a valid Date instance',
  }),
  /** UserId of the actor who created the record, or null for system-generated records */
  createdBy: AuditSchema.fields.createdBy.annotations({
    message: () =>
      '@Solverse/User: createdBy must be null or a valid user UUID v4',
  }),
  /** Timestamp of the most recent update to any field */
  updatedAt: AuditSchema.fields.updatedAt.annotations({
    message: () => '@Solverse/User: updatedAt must be a valid Date instance',
  }),
  /** UserId of the actor who last updated the record, or null for system-generated updates */
  updatedBy: AuditSchema.fields.updatedBy.annotations({
    message: () =>
      '@Solverse/User: updatedBy must be null or a valid user UUID v4',
  }),
  /** Timestamp when the record was soft-deleted, or null if not deleted */
  deletedAt: AuditSchema.fields.deletedAt.annotations({
    message: () =>
      '@Solverse/User: deletedAt must be null or a valid Date instance',
  }),
  /** UserId of the actor who soft-deleted the record, or null if not deleted */
  deletedBy: AuditSchema.fields.deletedBy.annotations({
    message: () =>
      '@Solverse/User: deletedBy must be null or a valid user UUID v4',
  }),
  /** Whether the record has been soft-deleted — always filter on this before returning data */
  isDeleted: AuditSchema.fields.isDeleted.annotations({
    message: () => '@Solverse/User: isDeleted must be a boolean',
  }),
})

/** Plain data type inferred from `UserSchema` — used internally by the aggregate. */
export type UserData = typeof UserSchema.Type
