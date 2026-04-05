import { Schema } from 'effect'

/**
 * Subscription plan tier for a Business.
 *
 * - `free`       — limited locations, staff, and bookings per month
 * - `starter`    — single location, up to 5 staff members
 * - `pro`        — multiple locations, unlimited staff, advanced analytics
 * - `enterprise` — custom limits, SLA, dedicated support
 */
const VALID_BUSINESS_PLANS: readonly string[] = [
  'free',
  'starter',
  'pro',
  'enterprise',
]

export type BusinessPlanType = 'free' | 'starter' | 'pro' | 'enterprise'

export const BusinessPlan = Schema.String.pipe(
  Schema.filter(
    (s): s is BusinessPlanType => VALID_BUSINESS_PLANS.includes(s),
    {
      message: () =>
        '@Solverse/Business: plan must be one of "free", "starter", "pro", or "enterprise"',
    },
  ),
)

export type BusinessPlan = typeof BusinessPlan.Type
