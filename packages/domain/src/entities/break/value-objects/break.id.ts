import { Schema } from 'effect'

export const BreakId = Schema.String.pipe(
  Schema.pattern(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    {
      message: () =>
        '@Solverse/Break: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    },
  ),
  Schema.brand('BreakId'),
)

export type BreakId = typeof BreakId.Type
