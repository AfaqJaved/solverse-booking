import { Schema } from 'effect'

/**
 * Branded UUID v4 string that uniquely identifies a WorkingHours record.
 *
 * Valid:   "550e8400-e29b-41d4-a716-446655440000"
 * Invalid: "not-a-uuid", "550e8400e29b41d4a716446655440000"
 */
export const WorkingHoursId = Schema.String.pipe(
  Schema.pattern(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  ),
  Schema.brand('WorkingHoursId'),
)

export type WorkingHoursId = typeof WorkingHoursId.Type
