import { Schema } from 'effect'
import { UserId } from '../user/entry'
import { AuditSchema } from '../common/entry'
import { BusinessEmail } from './value-objects/email'
import { BusinessPhoneNumber } from './value-objects/phone.number'
import { BusinessTimezone } from './value-objects/timezone'
import {
  BusinessId,
  BusinessName,
  BusinessPlan,
  BusinessSlug,
  BusinessStatus,
  BusinessCurrency,
} from './entry'

/**
 * Effect Schema for the raw Business data shape.
 *
 * Used at system boundaries (database reads, API payloads, domain events)
 * to parse and validate untrusted data before constructing a `Business` aggregate.
 * Never use this schema deep inside domain logic — decode at the edges only.
 */
export const BusinessSchema = Schema.Struct({
  /** Unique identifier — UUID v4 */
  id: BusinessId.annotations({
    message: () =>
      '@Solverse/Business: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
  }),
  /** UUID v4 of the User who owns this business — must have role `businessOwner` */
  ownerId: UserId.annotations({
    message: () =>
      '@Solverse/Business: ownerId must be a valid user UUID v4 (the businessOwner who owns this business)',
  }),
  /** Public display name of the business */
  name: BusinessName.annotations({
    message: () =>
      '@Solverse/Business: name must be a string between 2 and 100 characters (e.g. "Acme Salon & Spa")',
  }),
  /** URL-safe slug used in booking links: `/<slug>/book` — must be globally unique */
  slug: BusinessSlug.annotations({
    message: () =>
      '@Solverse/Business: slug must be 3–50 lowercase alphanumeric characters with hyphens allowed but not at start or end (e.g. "acme-salon")',
  }),
  /** Primary contact email for the business */
  email: BusinessEmail.annotations({
    message: () =>
      '@Solverse/Business: email must be a valid lowercase email address (e.g. "contact@acme.com")',
  }),
  /** Optional E.164-formatted contact phone number */
  phone: Schema.NullOr(BusinessPhoneNumber).annotations({
    message: () =>
      '@Solverse/Business: phone must be null or a valid E.164 phone number (e.g. "+12025551234")',
  }),
  /** Default IANA timezone for the business — used when no location overrides it */
  timezone: BusinessTimezone.annotations({
    message: () =>
      '@Solverse/Business: timezone must be a valid IANA timezone identifier (e.g. "America/New_York")',
  }),
  /** Current lifecycle status of the business account */
  status: BusinessStatus.annotations({
    message: () =>
      '@Solverse/Business: status must be one of "pending_verification", "active", "inactive", or "suspended"',
  }),
  /** Subscription plan governing feature access and usage limits */
  plan: BusinessPlan.annotations({
    message: () =>
      '@Solverse/Business: plan must be one of "free", "starter", "pro", or "enterprise"',
  }),
  /** ISO 4217 currency code used for all services (e.g. "USD", "EUR") */
  currency: BusinessCurrency.annotations({
    message: () =>
      '@Solverse/Business: currency must be a valid ISO 4217 code — exactly 3 uppercase letters (e.g. "USD", "EUR")',
  }),
  /** Optional public logo URL (must be http/https) */
  logoUrl: Schema.NullOr(
    Schema.String.pipe(Schema.pattern(/^https?:\/\//)),
  ).annotations({
    message: () =>
      '@Solverse/Business: logoUrl must be null or a valid http/https URL',
  }),
  /** Optional short description shown on the public booking page */
  description: Schema.NullOr(
    Schema.String.pipe(Schema.maxLength(500)),
  ).annotations({
    message: () =>
      '@Solverse/Business: description must be null or a string of at most 500 characters',
  }),
  /** Optional business website URL (must be http/https) */
  website: Schema.NullOr(
    Schema.String.pipe(Schema.pattern(/^https?:\/\//)),
  ).annotations({
    message: () =>
      '@Solverse/Business: website must be null or a valid http/https URL',
  }),
  /** Human-readable reason provided when the business was suspended, or null */
  suspendedReason: Schema.NullOr(Schema.String).annotations({
    message: () =>
      '@Solverse/Business: suspendedReason must be null or a string',
  }),
  /** Timestamp when the record was first created */
  createdAt: AuditSchema.fields.createdAt.annotations({
    message: () =>
      '@Solverse/Business: createdAt must be a valid Date instance',
  }),
  /** UserId of the actor who created the record, or null for system-generated records */
  createdBy: AuditSchema.fields.createdBy.annotations({
    message: () =>
      '@Solverse/Business: createdBy must be null or a valid user UUID v4',
  }),
  /** Timestamp of the most recent update to any field */
  updatedAt: AuditSchema.fields.updatedAt.annotations({
    message: () =>
      '@Solverse/Business: updatedAt must be a valid Date instance',
  }),
  /** UserId of the actor who last updated the record, or null for system-generated updates */
  updatedBy: AuditSchema.fields.updatedBy.annotations({
    message: () =>
      '@Solverse/Business: updatedBy must be null or a valid user UUID v4',
  }),
  /** Timestamp when the record was soft-deleted, or null if not deleted */
  deletedAt: AuditSchema.fields.deletedAt.annotations({
    message: () =>
      '@Solverse/Business: deletedAt must be null or a valid Date instance',
  }),
  /** UserId of the actor who soft-deleted the record, or null if not deleted */
  deletedBy: AuditSchema.fields.deletedBy.annotations({
    message: () =>
      '@Solverse/Business: deletedBy must be null or a valid user UUID v4',
  }),
  /** Whether the record has been soft-deleted — always filter on this before returning data */
  isDeleted: AuditSchema.fields.isDeleted.annotations({
    message: () => '@Solverse/Business: isDeleted must be a boolean',
  }),
})

/** Plain data type inferred from `BusinessSchema` — used internally by the aggregate. */
export type BusinessData = typeof BusinessSchema.Type
