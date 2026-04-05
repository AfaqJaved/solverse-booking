import { Schema } from 'effect'

/**
 * Availability status of a Service.
 *
 * - `active`   — visible and bookable by customers
 * - `inactive` — hidden from customers, not bookable (e.g. seasonal or paused)
 */
const VALID_SERVICE_STATUSES: readonly string[] = ['active', 'inactive']

export type ServiceStatusType = 'active' | 'inactive'

export const ServiceStatus = Schema.String.pipe(
  Schema.filter(
    (s): s is ServiceStatusType => VALID_SERVICE_STATUSES.includes(s),
    {
      message: () =>
        '@Solverse/Service: status must be one of "active" or "inactive"',
    },
  ),
)

export type ServiceStatus = typeof ServiceStatus.Type
