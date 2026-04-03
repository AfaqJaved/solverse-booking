import { Schema } from 'effect'

/**
 * Branded display name for a Business.
 *
 * Accepts any printable characters (supports international business names),
 * trimmed to 2–100 characters. Not used in URLs — see `BusinessSlug` for that.
 *
 * Valid:   "Acme Salon & Spa", "Dr. Smith's Clinic", "城市健身房"
 * Invalid: "" (empty), single character, > 100 characters
 */
export const BusinessName = Schema.String.pipe(
  Schema.minLength(2),
  Schema.maxLength(100),
  Schema.brand('BusinessName'),
)

export type BusinessName = typeof BusinessName.Type
