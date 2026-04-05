import { Schema } from 'effect'

/**
 * Role assigned to a user — determines access scope across the platform.
 *
 * - `superAdmin`     — internal SaaS team member with full platform access.
 *                      Can manage all tenants, businesses, locations, and users.
 *                      Never assigned to external/paying customers.
 *
 * - `businessOwner`  — top-level paying customer who owns a business account.
 *                      Has full control over their own business and all its locations.
 *                      Cannot access other tenants or platform internals.
 *
 * - `locationOwner`  — staff member assigned to manage a single branch/location.
 *                      Scoped strictly to their assigned location.
 *                      Cannot manage other locations or business-level settings.
 */
export type UserRoleType = 'superAdmin' | 'businessOwner' | 'locationOwner'

const VALID_ROLES: readonly string[] = ['superAdmin', 'businessOwner', 'locationOwner']

export const UserRole = Schema.String.pipe(
  Schema.filter(
    (s): s is UserRoleType => VALID_ROLES.includes(s),
    {
      message: () => '@Solverse/User: role must be one of "superAdmin", "businessOwner", or "locationOwner"',
    },
  ),
)
export type UserRole = typeof UserRole.Type
