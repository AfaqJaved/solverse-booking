import { Schema } from 'effect'

/**
 * Branded ISO 4217 currency code for a business.
 *
 * Must be exactly 3 uppercase letters.
 *
 * Valid:   "USD", "EUR", "GBP", "PKR"
 * Invalid: "usd" (lowercase), "US" (too short), "USDD" (too long)
 */
export const BusinessCurrency = Schema.String.pipe(
  Schema.pattern(/^[A-Z]{3}$/, {
    message: () =>
      '@Solverse/Business: currency must be a valid ISO 4217 code — exactly 3 uppercase letters (e.g. "USD", "EUR")',
  }),
  Schema.brand('BusinessCurrency'),
)

export type BusinessCurrency = typeof BusinessCurrency.Type
