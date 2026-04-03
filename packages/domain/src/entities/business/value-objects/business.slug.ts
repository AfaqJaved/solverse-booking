import { Schema } from 'effect'

/**
 * Branded URL-safe slug that uniquely identifies a Business on the platform.
 *
 * Used to construct public booking URLs: `/<slug>/book`
 *
 * Rules: 3–50 characters, lowercase alphanumeric with hyphens allowed
 * (not at start or end). No underscores — slugs are user-visible in URLs.
 *
 * Valid:   "acme-salon", "dr-smith", "city-gym"
 * Invalid: "-acme" (leading hyphen), "Acme" (uppercase), "a b" (spaces)
 */
export const BusinessSlug = Schema.String.pipe(
  Schema.pattern(/^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$|^[a-z0-9]{3}$/),
  Schema.brand('BusinessSlug'),
)

export type BusinessSlug = typeof BusinessSlug.Type
