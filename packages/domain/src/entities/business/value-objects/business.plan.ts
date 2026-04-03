import { Schema } from 'effect'

/**
 * Subscription plan tier for a Business.
 *
 * - `free`       — limited locations, staff, and bookings per month
 * - `starter`    — single location, up to 5 staff members
 * - `pro`        — multiple locations, unlimited staff, advanced analytics
 * - `enterprise` — custom limits, SLA, dedicated support
 */
export const BusinessPlan = Schema.Literal('free', 'starter', 'pro', 'enterprise')

export type BusinessPlan = typeof BusinessPlan.Type
