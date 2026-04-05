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
  Schema.minLength(2, {
    message: () => '@Solverse/Business: name must be at least 2 characters',
  }),
  Schema.maxLength(100, {
    message: () => '@Solverse/Business: name must be at most 100 characters',
  }),
  Schema.brand('BusinessName'),
)

export type BusinessName = typeof BusinessName.Type
