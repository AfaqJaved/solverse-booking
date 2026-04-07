import { describe, expect, it } from 'vitest'
import { ParseResult, Schema } from 'effect'
import { BreakSchema } from './break.entity'

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

const getMessages = (input: unknown): string[] => {
  try {
    Schema.decodeUnknownSync(BreakSchema)(input)
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

const validBreak: unknown = {
  id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  workingHoursId: 'a47ac10b-58cc-4372-a567-0e02b2c3d480',
  label: 'Lunch break',
  startTime: '12:00',
  endTime: '13:00',
  createdAt: new Date('2024-01-01'),
  createdBy: null,
  updatedAt: new Date('2024-01-01'),
  updatedBy: null,
  deletedAt: null,
  deletedBy: null,
  isDeleted: false,
}

const with_ = (overrides: Record<string, unknown>): unknown => ({
  ...(validBreak as object),
  ...overrides,
})

// ---------------------------------------------------------------------------
// Sanity check
// ---------------------------------------------------------------------------

describe('BreakSchema — valid input', () => {
  it('accepts a fully valid break object', () => {
    expect(getMessages(validBreak)).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// id
// ---------------------------------------------------------------------------

describe('BreakSchema — id', () => {
  it('rejects a non-UUID string', () => {
    const messages = getMessages(with_({ id: 'not-a-uuid' }))
    expect(messages).toContain(
      '@Solverse/Break: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })

  it('rejects a UUID v1', () => {
    const messages = getMessages(
      with_({ id: '123e4567-e89b-12d3-a456-426614174000' }),
    )
    expect(messages).toContain(
      '@Solverse/Break: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })
})

// ---------------------------------------------------------------------------
// workingHoursId
// ---------------------------------------------------------------------------

describe('BreakSchema — workingHoursId', () => {
  it('rejects a non-UUID string', () => {
    const messages = getMessages(with_({ workingHoursId: 'not-a-uuid' }))
    // WorkingHoursId has its own pattern message
    expect(messages).toContain(
      '@Solverse/WorkingHours: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })
})

// ---------------------------------------------------------------------------
// label
// ---------------------------------------------------------------------------

describe('BreakSchema — label', () => {
  it('accepts an empty label', () => {
    expect(getMessages(with_({ label: '' }))).toEqual([])
  })

  it('rejects a label over 100 characters', () => {
    const messages = getMessages(with_({ label: 'A'.repeat(101) }))
    // No custom annotation; raw maxLength message surfaces
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('100')]),
    )
  })

  it('rejects a non-string label', () => {
    const messages = getMessages(with_({ label: 42 }))
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('string')]),
    )
  })
})

// ---------------------------------------------------------------------------
// startTime
// ---------------------------------------------------------------------------

describe('BreakSchema — startTime', () => {
  it('accepts a valid HH:MM time', () => {
    expect(getMessages(with_({ startTime: '12:00' }))).toEqual([])
  })

  it('rejects a time without leading zero', () => {
    const messages = getMessages(with_({ startTime: '9:00' }))
    expect(messages).toContain(
      '@Solverse/Break: time must be in HH:MM 24-hour format (e.g. "09:00", "17:30")',
    )
  })

  it('rejects an out-of-range hour', () => {
    const messages = getMessages(with_({ startTime: '25:00' }))
    expect(messages).toContain(
      '@Solverse/Break: time must be in HH:MM 24-hour format (e.g. "09:00", "17:30")',
    )
  })

  it('rejects an out-of-range minute', () => {
    const messages = getMessages(with_({ startTime: '12:60' }))
    expect(messages).toContain(
      '@Solverse/Break: time must be in HH:MM 24-hour format (e.g. "09:00", "17:30")',
    )
  })

  it('rejects a plain string', () => {
    const messages = getMessages(with_({ startTime: 'noon' }))
    expect(messages).toContain(
      '@Solverse/Break: time must be in HH:MM 24-hour format (e.g. "09:00", "17:30")',
    )
  })
})

// ---------------------------------------------------------------------------
// endTime
// ---------------------------------------------------------------------------

describe('BreakSchema — endTime', () => {
  it('accepts a valid HH:MM time', () => {
    expect(getMessages(with_({ endTime: '13:00' }))).toEqual([])
  })

  it('rejects a time in 12h format with AM/PM', () => {
    const messages = getMessages(with_({ endTime: '1:00 PM' }))
    expect(messages).toContain(
      '@Solverse/Break: time must be in HH:MM 24-hour format (e.g. "09:00", "17:30")',
    )
  })

  it('rejects an out-of-range hour', () => {
    const messages = getMessages(with_({ endTime: '24:00' }))
    expect(messages).toContain(
      '@Solverse/Break: time must be in HH:MM 24-hour format (e.g. "09:00", "17:30")',
    )
  })
})

// ---------------------------------------------------------------------------
// Audit fields (spread from AuditSchema — no custom @Solverse/Break annotations)
// ---------------------------------------------------------------------------

describe('BreakSchema — createdAt', () => {
  it('rejects a date string instead of a Date instance', () => {
    const messages = getMessages(with_({ createdAt: '2024-01-01' }))
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('DateFromSelf')]),
    )
  })
})

describe('BreakSchema — createdBy', () => {
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

describe('BreakSchema — updatedAt', () => {
  it('rejects a date string instead of a Date instance', () => {
    const messages = getMessages(with_({ updatedAt: '2024-01-01' }))
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('DateFromSelf')]),
    )
  })
})

describe('BreakSchema — deletedAt', () => {
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

describe('BreakSchema — deletedBy', () => {
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

describe('BreakSchema — isDeleted', () => {
  it('rejects a string instead of boolean', () => {
    const messages = getMessages(with_({ isDeleted: 'false' }))
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('boolean')]),
    )
  })
})
