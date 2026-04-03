import { Schema } from 'effect'
import { UserId } from '../user/entry'
import { AuditSchema, Timezone, Email, PhoneNumber } from '../common/entry'
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
  id: BusinessId,
  /** UUID v4 of the User who owns this business — must have role `businessOwner` */
  ownerId: UserId,
  /** Public display name of the business */
  name: BusinessName,
  /** URL-safe slug used in booking links: `/<slug>/book` — must be globally unique */
  slug: BusinessSlug,
  /** Primary contact email for the business */
  email: Email,
  /** Optional E.164-formatted contact phone number */
  phone: Schema.NullOr(PhoneNumber),
  /** Default IANA timezone for the business — used when no location overrides it */
  timezone: Timezone,
  /** Current lifecycle status of the business account */
  status: BusinessStatus,
  /** Subscription plan governing feature access and usage limits */
  plan: BusinessPlan,
  /** ISO 4217 currency code used for all services (e.g. "USD", "EUR") */
  currency: BusinessCurrency,
  /** Optional public logo URL (must be http/https) */
  logoUrl: Schema.NullOr(Schema.String.pipe(Schema.pattern(/^https?:\/\//))),
  /** Optional short description shown on the public booking page */
  description: Schema.NullOr(Schema.String.pipe(Schema.maxLength(500))),
  /** Optional business website URL (must be http/https) */
  website: Schema.NullOr(Schema.String.pipe(Schema.pattern(/^https?:\/\//))),
  /** Human-readable reason provided when the business was suspended, or null */
  suspendedReason: Schema.NullOr(Schema.String),
  /** Shared audit trail fields (createdAt/By, updatedAt/By, deletedAt/By, isDeleted) */
  ...AuditSchema.fields,
})

/** Plain data type inferred from `BusinessSchema` — used internally by the aggregate. */
export type BusinessData = typeof BusinessSchema.Type
