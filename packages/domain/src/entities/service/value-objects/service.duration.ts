import { Schema } from 'effect'

/**
 * Branded service duration in minutes.
 *
 * Must be a positive integer between 5 and 480 minutes (8 hours).
 * Stored as minutes to avoid fractional values.
 *
 * Valid:   5, 30, 60, 90, 120
 * Invalid: 0, -1, 4 (below minimum), 481 (above maximum), 30.5 (non-integer)
 */
export const ServiceDuration = Schema.Int.pipe(
  Schema.between(5, 480, {
    message: () =>
      '@Solverse/Service: duration must be an integer between 5 and 480 minutes',
  }),
  Schema.brand('ServiceDuration'),
)

export type ServiceDuration = typeof ServiceDuration.Type
