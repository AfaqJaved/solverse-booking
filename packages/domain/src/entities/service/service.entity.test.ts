import { describe, expect, it } from 'vitest'
import { ParseResult, Schema } from 'effect'
import { ServiceSchema } from './service.entity'

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

const getMessages = (input: unknown): string[] => {
  try {
    Schema.decodeUnknownSync(ServiceSchema)(input)
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

const validService: unknown = {
  id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  businessId: 'a47ac10b-58cc-4372-a567-0e02b2c3d480',
  name: 'Haircut',
  description: null,
  duration: 30,
  bufferTime: 0,
  price: 2500,
  status: 'active',
  color: null,
  maxBookingsPerSlot: 1,
  createdAt: new Date('2024-01-01'),
  createdBy: null,
  updatedAt: new Date('2024-01-01'),
  updatedBy: null,
  deletedAt: null,
  deletedBy: null,
  isDeleted: false,
}

const with_ = (overrides: Record<string, unknown>): unknown => ({
  ...(validService as object),
  ...overrides,
})

// ---------------------------------------------------------------------------
// Sanity check
// ---------------------------------------------------------------------------

describe('ServiceSchema — valid input', () => {
  it('accepts a fully valid service object', () => {
    expect(getMessages(validService)).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// id
// ---------------------------------------------------------------------------

describe('ServiceSchema — id', () => {
  it('rejects a non-UUID string', () => {
    const messages = getMessages(with_({ id: 'not-a-uuid' }))
    expect(messages).toContain(
      '@Solverse/Service: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })

  it('rejects a UUID v1', () => {
    const messages = getMessages(with_({ id: '123e4567-e89b-12d3-a456-426614174000' }))
    expect(messages).toContain(
      '@Solverse/Service: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })
})

// ---------------------------------------------------------------------------
// businessId
// ---------------------------------------------------------------------------

describe('ServiceSchema — businessId', () => {
  it('rejects a non-UUID string', () => {
    const messages = getMessages(with_({ businessId: 'not-a-uuid' }))
    expect(messages).toContain(
      '@Solverse/Business: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })
})

// ---------------------------------------------------------------------------
// name
// ---------------------------------------------------------------------------

describe('ServiceSchema — name', () => {
  it('rejects a name shorter than 2 characters', () => {
    const messages = getMessages(with_({ name: 'H' }))
    expect(messages).toContain('@Solverse/Service: name must be at least 2 characters')
  })

  it('rejects a name longer than 100 characters', () => {
    const messages = getMessages(with_({ name: 'H'.repeat(101) }))
    expect(messages).toContain('@Solverse/Service: name must be at most 100 characters')
  })
})

// ---------------------------------------------------------------------------
// description
// ---------------------------------------------------------------------------

describe('ServiceSchema — description', () => {
  it('accepts null', () => {
    expect(getMessages(with_({ description: null }))).toEqual([])
  })

  it('accepts a short description', () => {
    expect(getMessages(with_({ description: 'A classic haircut.' }))).toEqual([])
  })

  it('rejects a description over 500 characters', () => {
    const messages = getMessages(with_({ description: 'A'.repeat(501) }))
    // No custom annotation; raw maxLength message surfaces
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('500')]),
    )
  })
})

// ---------------------------------------------------------------------------
// duration
// ---------------------------------------------------------------------------

describe('ServiceSchema — duration', () => {
  it('rejects a duration below 5 minutes', () => {
    const messages = getMessages(with_({ duration: 4 }))
    expect(messages).toContain(
      '@Solverse/Service: duration must be an integer between 5 and 480 minutes',
    )
  })

  it('rejects a duration above 480 minutes', () => {
    const messages = getMessages(with_({ duration: 481 }))
    expect(messages).toContain(
      '@Solverse/Service: duration must be an integer between 5 and 480 minutes',
    )
  })

  it('rejects a non-integer duration', () => {
    const messages = getMessages(with_({ duration: 30.5 }))
    // Schema.Int rejects non-integers before the between check
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('integer')]),
    )
  })
})

// ---------------------------------------------------------------------------
// bufferTime
// ---------------------------------------------------------------------------

describe('ServiceSchema — bufferTime', () => {
  it('accepts 0', () => {
    expect(getMessages(with_({ bufferTime: 0 }))).toEqual([])
  })

  it('rejects a negative buffer time', () => {
    const messages = getMessages(with_({ bufferTime: -1 }))
    // No custom annotation; Effect's greaterThanOrEqualTo message surfaces
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('non-negative')]),
    )
  })

  it('rejects a non-integer value', () => {
    const messages = getMessages(with_({ bufferTime: 5.5 }))
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('integer')]),
    )
  })
})

// ---------------------------------------------------------------------------
// price
// ---------------------------------------------------------------------------

describe('ServiceSchema — price', () => {
  it('accepts 0 (free service)', () => {
    expect(getMessages(with_({ price: 0 }))).toEqual([])
  })

  it('rejects a negative price', () => {
    const messages = getMessages(with_({ price: -1 }))
    expect(messages).toContain(
      '@Solverse/Service: price must be a non-negative integer (smallest currency unit, e.g. cents)',
    )
  })

  it('rejects a non-integer price', () => {
    const messages = getMessages(with_({ price: 25.50 }))
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('integer')]),
    )
  })
})

// ---------------------------------------------------------------------------
// status
// ---------------------------------------------------------------------------

describe('ServiceSchema — status', () => {
  it('rejects an unknown status', () => {
    const messages = getMessages(with_({ status: 'archived' }))
    expect(messages).toContain(
      '@Solverse/Service: status must be one of "active" or "inactive"',
    )
  })

  it('rejects an empty status string', () => {
    const messages = getMessages(with_({ status: '' }))
    expect(messages).toContain(
      '@Solverse/Service: status must be one of "active" or "inactive"',
    )
  })
})

// ---------------------------------------------------------------------------
// color
// ---------------------------------------------------------------------------

describe('ServiceSchema — color', () => {
  it('accepts null', () => {
    expect(getMessages(with_({ color: null }))).toEqual([])
  })

  it('accepts a valid hex color', () => {
    expect(getMessages(with_({ color: '#FF5733' }))).toEqual([])
  })

  it('rejects a hex color without #', () => {
    const messages = getMessages(with_({ color: 'FF5733' }))
    // No custom annotation; raw pattern message surfaces
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('matching the pattern')]),
    )
  })

  it('rejects a 3-digit shorthand hex color', () => {
    const messages = getMessages(with_({ color: '#FFF' }))
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('matching the pattern')]),
    )
  })
})

// ---------------------------------------------------------------------------
// maxBookingsPerSlot
// ---------------------------------------------------------------------------

describe('ServiceSchema — maxBookingsPerSlot', () => {
  it('accepts 1', () => {
    expect(getMessages(with_({ maxBookingsPerSlot: 1 }))).toEqual([])
  })

  it('rejects 0', () => {
    const messages = getMessages(with_({ maxBookingsPerSlot: 0 }))
    // No custom annotation; raw greaterThanOrEqualTo message surfaces
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('1')]),
    )
  })

  it('rejects a non-integer value', () => {
    const messages = getMessages(with_({ maxBookingsPerSlot: 1.5 }))
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('integer')]),
    )
  })
})

// ---------------------------------------------------------------------------
// Audit fields (spread from AuditSchema — no custom @Solverse/Service annotations)
// ---------------------------------------------------------------------------

describe('ServiceSchema — createdAt', () => {
  it('rejects a date string instead of a Date instance', () => {
    const messages = getMessages(with_({ createdAt: '2024-01-01' }))
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('DateFromSelf')]),
    )
  })
})

describe('ServiceSchema — createdBy', () => {
  it('accepts null', () => {
    expect(getMessages(with_({ createdBy: null }))).toEqual([])
  })

  it('rejects a non-UUID string', () => {
    const messages = getMessages(with_({ createdBy: 'not-a-uuid' }))
    expect(messages).toContain(
      '@Solverse/User: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })
})

describe('ServiceSchema — updatedAt', () => {
  it('rejects a date string instead of a Date instance', () => {
    const messages = getMessages(with_({ updatedAt: '2024-01-01' }))
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('DateFromSelf')]),
    )
  })
})

describe('ServiceSchema — deletedAt', () => {
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

describe('ServiceSchema — isDeleted', () => {
  it('rejects a string instead of boolean', () => {
    const messages = getMessages(with_({ isDeleted: 'false' }))
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('boolean')]),
    )
  })
})
