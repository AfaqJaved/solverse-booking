import { Schema } from 'effect'

/**
 * Branded display name for a Service.
 *
 * Accepts any printable characters (supports international service names),
 * trimmed to 2–100 characters.
 *
 * Valid:   "Haircut", "Full Body Massage", "Dental Checkup"
 * Invalid: "" (empty), single character, > 100 characters
 */
export const ServiceName = Schema.String.pipe(
  Schema.minLength(2, { message: () => '@Solverse/Service: name must be at least 2 characters' }),
  Schema.maxLength(100, { message: () => '@Solverse/Service: name must be at most 100 characters' }),
  Schema.brand('ServiceName'),
)

export type ServiceName = typeof ServiceName.Type
