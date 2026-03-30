import { Schema } from 'effect';

/**
 * Lifecycle status of a user account.
 *
 * - `pending_verification` — newly registered, awaiting email confirmation
 * - `active`               — fully verified and operational
 * - `inactive`             — voluntarily deactivated by the user
 * - `suspended`            — administratively suspended with a stated reason
 */
export const UserStatus = Schema.Literal(
  'pending_verification',
  'active',
  'inactive',
  'suspended',
);
export type UserStatus = typeof UserStatus.Type;
