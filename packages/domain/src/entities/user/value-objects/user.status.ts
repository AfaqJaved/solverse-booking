import { Schema } from 'effect'

/**
 * Lifecycle status of a user account.
 *
 * - `pending_verification` — newly registered, awaiting email confirmation
 * - `active`               — fully verified and operational
 * - `inactive`             — voluntarily deactivated by the user
 * - `suspended`            — administratively suspended with a stated reason
 */
const VALID_USER_STATUSES: readonly string[] = [
  'pending_verification',
  'active',
  'inactive',
  'suspended',
]

export type UserStatusType =
  | 'pending_verification'
  | 'active'
  | 'inactive'
  | 'suspended'

export const UserStatus = Schema.String.pipe(
  Schema.filter(
    (s): s is UserStatusType => VALID_USER_STATUSES.includes(s),
    {
      message: () =>
        '@Solverse/User: status must be one of "pending_verification", "active", "inactive", or "suspended"',
    },
  ),
)
export type UserStatus = typeof UserStatus.Type
