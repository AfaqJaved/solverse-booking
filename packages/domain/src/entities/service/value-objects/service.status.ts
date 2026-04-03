import { Schema } from 'effect'

/**
 * Availability status of a Service.
 *
 * - `active`   — visible and bookable by customers
 * - `inactive` — hidden from customers, not bookable (e.g. seasonal or paused)
 */
export const ServiceStatus = Schema.Literal('active', 'inactive')

export type ServiceStatus = typeof ServiceStatus.Type
