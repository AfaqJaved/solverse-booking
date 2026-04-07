import { Schema } from 'effect'

/**
 * Branded UUID v4 string that uniquely identifies a Service.
 *
 * Enforces UUID v4 format at parse time — cannot be constructed
 * from an arbitrary string without going through the schema.
 */
export const ServiceId = Schema.String.pipe(
  Schema.pattern(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    {
      message: () =>
        '@Solverse/Service: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    },
  ),
  Schema.brand('ServiceId'),
)

export type ServiceId = typeof ServiceId.Type
