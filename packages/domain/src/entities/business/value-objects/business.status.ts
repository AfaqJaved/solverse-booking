import { Schema } from 'effect'

/**
 * Lifecycle status of a Business account.
 *
 * - `pending_verification` — newly created, awaiting owner email confirmation
 * - `active`               — verified and accepting bookings
 * - `inactive`             — voluntarily paused by the owner (no new bookings)
 * - `suspended`            — administratively suspended with a stated reason
 */
const VALID_BUSINESS_STATUSES: readonly string[] = [
  'pending_verification',
  'active',
  'inactive',
  'suspended',
]

export type BusinessStatusType =
  | 'pending_verification'
  | 'active'
  | 'inactive'
  | 'suspended'

export const BusinessStatus = Schema.String.pipe(
  Schema.filter(
    (s): s is BusinessStatusType => VALID_BUSINESS_STATUSES.includes(s),
    {
      message: () =>
        '@Solverse/Business: status must be one of "pending_verification", "active", "inactive", or "suspended"',
    },
  ),
)

export type BusinessStatus = typeof BusinessStatus.Type
