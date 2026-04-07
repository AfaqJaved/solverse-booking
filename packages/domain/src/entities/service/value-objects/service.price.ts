import { Schema } from 'effect'

/**
 * Branded service price stored in the smallest currency unit (e.g. cents for USD).
 *
 * Using integers avoids floating-point rounding errors in monetary calculations.
 * A value of 0 represents a free service.
 *
 * Valid:   0 (free), 2500 ($25.00), 15000 ($150.00)
 * Invalid: -1 (negative), 25.50 (non-integer)
 */
export const ServicePrice = Schema.Int.pipe(
  Schema.greaterThanOrEqualTo(0, {
    message: () =>
      '@Solverse/Service: price must be a non-negative integer (smallest currency unit, e.g. cents)',
  }),
  Schema.brand('ServicePrice'),
)

export type ServicePrice = typeof ServicePrice.Type
