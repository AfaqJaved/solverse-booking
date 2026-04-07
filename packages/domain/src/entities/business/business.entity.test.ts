import { describe, expect, it } from 'vitest'
import { ParseResult, Schema } from 'effect'
import { BusinessSchema } from './business.entity'

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

const getMessages = (input: unknown): string[] => {
  try {
    Schema.decodeUnknownSync(BusinessSchema)(input)
    return []
  } catch (e) {
    if (e instanceof ParseResult.ParseError) {
      return ParseResult.ArrayFormatter.formatErrorSync(e).map(
        (issue) => issue.message,
      )
    }
    throw e
  }
}

// ---------------------------------------------------------------------------
// Valid base object — each test mutates a single field
// ---------------------------------------------------------------------------

const validBusiness: unknown = {
  id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  ownerId: 'a47ac10b-58cc-4372-a567-0e02b2c3d480',
  name: 'Acme Salon & Spa',
  slug: 'acme-salon',
  email: 'contact@acme.com',
  phone: null,
  timezone: 'America/New_York',
  status: 'active',
  plan: 'free',
  currency: 'USD',
  logoUrl: null,
  description: null,
  website: null,
  suspendedReason: null,
  createdAt: new Date('2024-01-01'),
  createdBy: null,
  updatedAt: new Date('2024-01-01'),
  updatedBy: null,
  deletedAt: null,
  deletedBy: null,
  isDeleted: false,
}

const with_ = (overrides: Record<string, unknown>): unknown => ({
  ...(validBusiness as object),
  ...overrides,
})

// ---------------------------------------------------------------------------
// Sanity check
// ---------------------------------------------------------------------------

describe('BusinessSchema — valid input', () => {
  it('accepts a fully valid business object', () => {
    expect(getMessages(validBusiness)).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// id
// ---------------------------------------------------------------------------

describe('BusinessSchema — id', () => {
  it('rejects a non-UUID string', () => {
    const messages = getMessages(with_({ id: 'not-a-uuid' }))
    expect(messages).toContain(
      '@Solverse/Business: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })

  it('rejects a UUID v1', () => {
    const messages = getMessages(
      with_({ id: '123e4567-e89b-12d3-a456-426614174000' }),
    )
    expect(messages).toContain(
      '@Solverse/Business: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })
})

// ---------------------------------------------------------------------------
// ownerId
// ---------------------------------------------------------------------------

describe('BusinessSchema — ownerId', () => {
  it('rejects a non-UUID string', () => {
    const messages = getMessages(with_({ ownerId: 'not-a-uuid' }))
    expect(messages).toContain(
      '@Solverse/Business: ownerId must be a valid user UUID v4 (the businessOwner who owns this business)',
    )
  })
})

// ---------------------------------------------------------------------------
// name
// ---------------------------------------------------------------------------

describe('BusinessSchema — name', () => {
  it('rejects a name shorter than 2 characters', () => {
    const messages = getMessages(with_({ name: 'A' }))
    expect(messages).toContain(
      '@Solverse/Business: name must be at least 2 characters',
    )
  })

  it('rejects a name longer than 100 characters', () => {
    const messages = getMessages(with_({ name: 'A'.repeat(101) }))
    // BusinessName is a branded pipeline — schema-level annotation overrides inner maxLength message
    expect(messages).toContain(
      '@Solverse/Business: name must be a string between 2 and 100 characters (e.g. "Acme Salon & Spa")',
    )
  })
})

// ---------------------------------------------------------------------------
// slug
// ---------------------------------------------------------------------------

describe('BusinessSchema — slug', () => {
  it('rejects a slug starting with a hyphen', () => {
    const messages = getMessages(with_({ slug: '-acme' }))
    // BusinessSlug is a branded pipeline — schema-level annotation overrides inner pattern message
    expect(messages).toContain(
      '@Solverse/Business: slug must be 3–50 lowercase alphanumeric characters with hyphens allowed but not at start or end (e.g. "acme-salon")',
    )
  })

  it('rejects a slug with uppercase letters', () => {
    const messages = getMessages(with_({ slug: 'Acme-Salon' }))
    expect(messages).toContain(
      '@Solverse/Business: slug must be 3–50 lowercase alphanumeric characters with hyphens allowed but not at start or end (e.g. "acme-salon")',
    )
  })

  it('rejects a slug shorter than 3 characters', () => {
    const messages = getMessages(with_({ slug: 'ab' }))
    expect(messages).toContain(
      '@Solverse/Business: slug must be 3–50 lowercase alphanumeric characters with hyphens allowed but not at start or end (e.g. "acme-salon")',
    )
  })

  it('rejects a slug with spaces', () => {
    const messages = getMessages(with_({ slug: 'acme salon' }))
    expect(messages).toContain(
      '@Solverse/Business: slug must be 3–50 lowercase alphanumeric characters with hyphens allowed but not at start or end (e.g. "acme-salon")',
    )
  })
})

// ---------------------------------------------------------------------------
// email
// ---------------------------------------------------------------------------

describe('BusinessSchema — email', () => {
  it('rejects a string without @', () => {
    const messages = getMessages(with_({ email: 'notanemail' }))
    expect(messages).toContain(
      '@Solverse/Business: email must be a valid lowercase email address (e.g. "contact@acme.com")',
    )
  })

  it('rejects an email missing the TLD', () => {
    const messages = getMessages(with_({ email: 'user@nodomain' }))
    expect(messages).toContain(
      '@Solverse/Business: email must be a valid lowercase email address (e.g. "contact@acme.com")',
    )
  })
})

// ---------------------------------------------------------------------------
// phone
// ---------------------------------------------------------------------------

describe('BusinessSchema — phone', () => {
  it('accepts null', () => {
    expect(getMessages(with_({ phone: null }))).toEqual([])
  })

  it('accepts a valid E.164 number', () => {
    expect(getMessages(with_({ phone: '+12025551234' }))).toEqual([])
  })

  it('rejects a phone not starting with +', () => {
    const messages = getMessages(with_({ phone: '12025551234' }))
    // NullOr annotation does not override; inner pattern message surfaces
    expect(messages).toContain(
      '@Solverse/Business: phone must be a valid E.164 number (e.g. "+12025551234") — must start with + followed by 8–15 digits',
    )
  })

  it('rejects a phone too short after +', () => {
    const messages = getMessages(with_({ phone: '+123' }))
    expect(messages).toContain(
      '@Solverse/Business: phone must be a valid E.164 number (e.g. "+12025551234") — must start with + followed by 8–15 digits',
    )
  })
})

// ---------------------------------------------------------------------------
// timezone
// ---------------------------------------------------------------------------

describe('BusinessSchema — timezone', () => {
  it('rejects an invalid IANA timezone', () => {
    const messages = getMessages(with_({ timezone: 'Not/ATimezone' }))
    expect(messages).toContain(
      '@Solverse/Business: timezone must be a valid IANA timezone identifier (e.g. "America/New_York")',
    )
  })
})

// ---------------------------------------------------------------------------
// status
// ---------------------------------------------------------------------------

describe('BusinessSchema — status', () => {
  it('rejects an unknown status', () => {
    const messages = getMessages(with_({ status: 'banned' }))
    expect(messages).toContain(
      '@Solverse/Business: status must be one of "pending_verification", "active", "inactive", or "suspended"',
    )
  })

  it('rejects an empty status string', () => {
    const messages = getMessages(with_({ status: '' }))
    expect(messages).toContain(
      '@Solverse/Business: status must be one of "pending_verification", "active", "inactive", or "suspended"',
    )
  })
})

// ---------------------------------------------------------------------------
// plan
// ---------------------------------------------------------------------------

describe('BusinessSchema — plan', () => {
  it('rejects an unknown plan', () => {
    const messages = getMessages(with_({ plan: 'premium' }))
    expect(messages).toContain(
      '@Solverse/Business: plan must be one of "free", "starter", "pro", or "enterprise"',
    )
  })

  it('rejects an empty plan string', () => {
    const messages = getMessages(with_({ plan: '' }))
    expect(messages).toContain(
      '@Solverse/Business: plan must be one of "free", "starter", "pro", or "enterprise"',
    )
  })
})

// ---------------------------------------------------------------------------
// currency
// ---------------------------------------------------------------------------

describe('BusinessSchema — currency', () => {
  it('rejects a lowercase currency code', () => {
    const messages = getMessages(with_({ currency: 'usd' }))
    expect(messages).toContain(
      '@Solverse/Business: currency must be a valid ISO 4217 code — exactly 3 uppercase letters (e.g. "USD", "EUR")',
    )
  })

  it('rejects a 2-letter code', () => {
    const messages = getMessages(with_({ currency: 'US' }))
    expect(messages).toContain(
      '@Solverse/Business: currency must be a valid ISO 4217 code — exactly 3 uppercase letters (e.g. "USD", "EUR")',
    )
  })

  it('rejects a 4-letter code', () => {
    const messages = getMessages(with_({ currency: 'USDD' }))
    expect(messages).toContain(
      '@Solverse/Business: currency must be a valid ISO 4217 code — exactly 3 uppercase letters (e.g. "USD", "EUR")',
    )
  })
})

// ---------------------------------------------------------------------------
// logoUrl
// ---------------------------------------------------------------------------

describe('BusinessSchema — logoUrl', () => {
  it('accepts null', () => {
    expect(getMessages(with_({ logoUrl: null }))).toEqual([])
  })

  it('accepts a valid https URL', () => {
    expect(
      getMessages(with_({ logoUrl: 'https://cdn.example.com/logo.png' })),
    ).toEqual([])
  })

  it('rejects a non-http URL', () => {
    const messages = getMessages(
      with_({ logoUrl: 'ftp://files.example.com/logo.png' }),
    )
    // NullOr annotation does not override; raw pattern message surfaces
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('matching the pattern')]),
    )
  })
})

// ---------------------------------------------------------------------------
// description
// ---------------------------------------------------------------------------

describe('BusinessSchema — description', () => {
  it('accepts null', () => {
    expect(getMessages(with_({ description: null }))).toEqual([])
  })

  it('accepts a short description', () => {
    expect(getMessages(with_({ description: 'We do hair.' }))).toEqual([])
  })

  it('rejects a description over 500 characters', () => {
    const messages = getMessages(with_({ description: 'A'.repeat(501) }))
    // NullOr annotation does not override; raw maxLength message surfaces
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('500')]),
    )
  })
})

// ---------------------------------------------------------------------------
// website
// ---------------------------------------------------------------------------

describe('BusinessSchema — website', () => {
  it('accepts null', () => {
    expect(getMessages(with_({ website: null }))).toEqual([])
  })

  it('accepts a valid https URL', () => {
    expect(getMessages(with_({ website: 'https://acme.com' }))).toEqual([])
  })

  it('rejects a non-http URL', () => {
    const messages = getMessages(with_({ website: 'ftp://acme.com' }))
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('matching the pattern')]),
    )
  })
})

// ---------------------------------------------------------------------------
// suspendedReason
// ---------------------------------------------------------------------------

describe('BusinessSchema — suspendedReason', () => {
  it('accepts null', () => {
    expect(getMessages(with_({ suspendedReason: null }))).toEqual([])
  })

  it('accepts a string reason', () => {
    expect(getMessages(with_({ suspendedReason: 'Violated terms' }))).toEqual(
      [],
    )
  })

  it('rejects a number', () => {
    const messages = getMessages(with_({ suspendedReason: 42 }))
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('Expected string')]),
    )
  })
})

// ---------------------------------------------------------------------------
// Audit fields
// ---------------------------------------------------------------------------

describe('BusinessSchema — createdAt', () => {
  it('rejects a date string instead of a Date instance', () => {
    const messages = getMessages(with_({ createdAt: '2024-01-01' }))
    expect(messages).toContain(
      '@Solverse/Business: createdAt must be a valid Date instance',
    )
  })

  it('rejects null', () => {
    const messages = getMessages(with_({ createdAt: null }))
    expect(messages).toContain(
      '@Solverse/Business: createdAt must be a valid Date instance',
    )
  })
})

describe('BusinessSchema — createdBy', () => {
  it('accepts null', () => {
    expect(getMessages(with_({ createdBy: null }))).toEqual([])
  })

  it('accepts a valid UUID v4', () => {
    expect(
      getMessages(with_({ createdBy: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })),
    ).toEqual([])
  })

  it('rejects a non-UUID string', () => {
    const messages = getMessages(with_({ createdBy: 'not-a-uuid' }))
    // NullOr annotation does not override inner messages; UserId's own prefix surfaces
    expect(messages).toContain(
      '@Solverse/User: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })
})

describe('BusinessSchema — updatedAt', () => {
  it('rejects a date string instead of a Date instance', () => {
    const messages = getMessages(with_({ updatedAt: '2024-01-01' }))
    expect(messages).toContain(
      '@Solverse/Business: updatedAt must be a valid Date instance',
    )
  })
})

describe('BusinessSchema — updatedBy', () => {
  it('rejects a non-UUID string', () => {
    const messages = getMessages(with_({ updatedBy: 'bad-id' }))
    expect(messages).toContain(
      '@Solverse/User: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })
})

describe('BusinessSchema — deletedAt', () => {
  it('accepts null', () => {
    expect(getMessages(with_({ deletedAt: null }))).toEqual([])
  })

  it('rejects a date string instead of a Date instance', () => {
    const messages = getMessages(with_({ deletedAt: '2024-01-01' }))
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('DateFromSelf')]),
    )
  })
})

describe('BusinessSchema — deletedBy', () => {
  it('accepts null', () => {
    expect(getMessages(with_({ deletedBy: null }))).toEqual([])
  })

  it('rejects a non-UUID string', () => {
    const messages = getMessages(with_({ deletedBy: 'not-a-uuid' }))
    expect(messages).toContain(
      '@Solverse/User: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })
})

describe('BusinessSchema — isDeleted', () => {
  it('rejects a string instead of boolean', () => {
    const messages = getMessages(with_({ isDeleted: 'false' }))
    expect(messages).toContain(
      '@Solverse/Business: isDeleted must be a boolean',
    )
  })

  it('rejects a number instead of boolean', () => {
    const messages = getMessages(with_({ isDeleted: 0 }))
    expect(messages).toContain(
      '@Solverse/Business: isDeleted must be a boolean',
    )
  })
})
