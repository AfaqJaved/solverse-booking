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
  Schema.minLength(2),
  Schema.maxLength(100),
  Schema.brand('ServiceName'),
)

export type ServiceName = typeof ServiceName.Type
