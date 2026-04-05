import { Schema } from 'effect'

export const BusinessEmail = Schema.String.pipe(
  Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: () =>
      '@Solverse/Business: email must be a valid lowercase email address (e.g. "contact@acme.com")',
  }),
  Schema.lowercased(),
  Schema.brand('BusinessEmail'),
)

export type BusinessEmail = typeof BusinessEmail.Type
