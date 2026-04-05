import { Schema } from 'effect'

/**
 * Branded UUID v4 string that uniquely identifies a Business.
 *
 * Enforces UUID v4 format at parse time — cannot be constructed
 * from an arbitrary string without going through the schema.
 *
 * Valid:   "550e8400-e29b-41d4-a716-446655440000"
 * Invalid: "not-a-uuid", "550e8400e29b41d4a716446655440000" (missing dashes)
 */
export const BusinessId = Schema.String.pipe(
  Schema.pattern(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    {
      message: () =>
        '@Solverse/Business: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    },
  ),
  Schema.brand('BusinessId'),
)

export type BusinessId = typeof BusinessId.Type
