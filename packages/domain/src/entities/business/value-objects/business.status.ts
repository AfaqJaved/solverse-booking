import { Schema } from 'effect'

/**
 * Lifecycle status of a Business account.
 *
 * - `pending_verification` — newly created, awaiting owner email confirmation
 * - `active`               — verified and accepting bookings
 * - `inactive`             — voluntarily paused by the owner (no new bookings)
 * - `suspended`            — administratively suspended with a stated reason
 */
export const BusinessStatus = Schema.Literal(
  'pending_verification',
  'active',
  'inactive',
  'suspended',
)

export type BusinessStatus = typeof BusinessStatus.Type
