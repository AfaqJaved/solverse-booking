import { describe, expect, it } from 'vitest'
import { ParseResult, Schema } from 'effect'
import { WorkingHoursSchema } from './working.hours.entity'

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

const getMessages = (input: unknown): string[] => {
  try {
    Schema.decodeUnknownSync(WorkingHoursSchema)(input)
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

const validWorkingHours: unknown = {
  id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  businessId: 'a47ac10b-58cc-4372-a567-0e02b2c3d480',
  dayOfWeek: 'monday',
  isOpen: true,
  openTime: '09:00',
  closeTime: '17:30',
  createdAt: new Date('2024-01-01'),
  createdBy: null,
  updatedAt: new Date('2024-01-01'),
  updatedBy: null,
  deletedAt: null,
  deletedBy: null,
  isDeleted: false,
}

const with_ = (overrides: Record<string, unknown>): unknown => ({
  ...(validWorkingHours as object),
  ...overrides,
})

// ---------------------------------------------------------------------------
// Sanity check
// ---------------------------------------------------------------------------

describe('WorkingHoursSchema — valid input', () => {
  it('accepts a fully valid working hours object', () => {
    expect(getMessages(validWorkingHours)).toEqual([])
  })

  it('accepts a closed day with null times', () => {
    expect(
      getMessages(with_({ isOpen: false, openTime: null, closeTime: null })),
    ).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// id
// ---------------------------------------------------------------------------

describe('WorkingHoursSchema — id', () => {
  it('rejects a non-UUID string', () => {
    const messages = getMessages(with_({ id: 'not-a-uuid' }))
    expect(messages).toContain(
      '@Solverse/WorkingHours: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })

  it('rejects a UUID v1', () => {
    const messages = getMessages(with_({ id: '123e4567-e89b-12d3-a456-426614174000' }))
    expect(messages).toContain(
      '@Solverse/WorkingHours: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })
})

// ---------------------------------------------------------------------------
// businessId
// ---------------------------------------------------------------------------

describe('WorkingHoursSchema — businessId', () => {
  it('rejects a non-UUID string', () => {
    const messages = getMessages(with_({ businessId: 'not-a-uuid' }))
    expect(messages).toContain(
      '@Solverse/WorkingHours: businessId must be a valid business UUID v4',
    )
  })
})

// ---------------------------------------------------------------------------
// dayOfWeek
// ---------------------------------------------------------------------------

describe('WorkingHoursSchema — dayOfWeek', () => {
  it('rejects an invalid day name', () => {
    const messages = getMessages(with_({ dayOfWeek: 'funday' }))
    expect(messages).toContain(
      '@Solverse/WorkingHours: dayOfWeek must be one of "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", or "sunday"',
    )
  })

  it('rejects a capitalised day name', () => {
    const messages = getMessages(with_({ dayOfWeek: 'Monday' }))
    expect(messages).toContain(
      '@Solverse/WorkingHours: dayOfWeek must be one of "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", or "sunday"',
    )
  })

  it('rejects an empty string', () => {
    const messages = getMessages(with_({ dayOfWeek: '' }))
    expect(messages).toContain(
      '@Solverse/WorkingHours: dayOfWeek must be one of "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", or "sunday"',
    )
  })

  it('accepts all valid days', () => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    for (const day of days) {
      expect(getMessages(with_({ dayOfWeek: day }))).toEqual([])
    }
  })
})

// ---------------------------------------------------------------------------
// isOpen
// ---------------------------------------------------------------------------

describe('WorkingHoursSchema — isOpen', () => {
  it('rejects a string instead of boolean', () => {
    const messages = getMessages(with_({ isOpen: 'true' }))
    expect(messages).toContain('@Solverse/WorkingHours: isOpen must be a boolean')
  })

  it('rejects a number instead of boolean', () => {
    const messages = getMessages(with_({ isOpen: 1 }))
    expect(messages).toContain('@Solverse/WorkingHours: isOpen must be a boolean')
  })
})

// ---------------------------------------------------------------------------
// openTime
// ---------------------------------------------------------------------------

describe('WorkingHoursSchema — openTime', () => {
  it('accepts null', () => {
    expect(getMessages(with_({ openTime: null }))).toEqual([])
  })

  it('accepts a valid HH:MM time', () => {
    expect(getMessages(with_({ openTime: '08:30' }))).toEqual([])
  })

  it('rejects an invalid time format', () => {
    const messages = getMessages(with_({ openTime: '9:00' }))
    // NullOr annotation does not override; inner WorkingHoursTimeOfDay message surfaces
    expect(messages).toContain(
      '@Solverse/WorkingHours: time must be in HH:MM 24-hour format (e.g. "09:00", "17:30")',
    )
  })

  it('rejects an out-of-range hour', () => {
    const messages = getMessages(with_({ openTime: '25:00' }))
    expect(messages).toContain(
      '@Solverse/WorkingHours: time must be in HH:MM 24-hour format (e.g. "09:00", "17:30")',
    )
  })

  it('rejects a plain string', () => {
    const messages = getMessages(with_({ openTime: 'nine-am' }))
    expect(messages).toContain(
      '@Solverse/WorkingHours: time must be in HH:MM 24-hour format (e.g. "09:00", "17:30")',
    )
  })
})

// ---------------------------------------------------------------------------
// closeTime
// ---------------------------------------------------------------------------

describe('WorkingHoursSchema — closeTime', () => {
  it('accepts null', () => {
    expect(getMessages(with_({ closeTime: null }))).toEqual([])
  })

  it('accepts a valid HH:MM time', () => {
    expect(getMessages(with_({ closeTime: '23:59' }))).toEqual([])
  })

  it('rejects an invalid time format', () => {
    const messages = getMessages(with_({ closeTime: '5:00 PM' }))
    expect(messages).toContain(
      '@Solverse/WorkingHours: time must be in HH:MM 24-hour format (e.g. "09:00", "17:30")',
    )
  })

  it('rejects an out-of-range minute', () => {
    const messages = getMessages(with_({ closeTime: '17:60' }))
    expect(messages).toContain(
      '@Solverse/WorkingHours: time must be in HH:MM 24-hour format (e.g. "09:00", "17:30")',
    )
  })
})

// ---------------------------------------------------------------------------
// Audit fields
// ---------------------------------------------------------------------------

describe('WorkingHoursSchema — createdAt', () => {
  it('rejects a date string instead of a Date instance', () => {
    const messages = getMessages(with_({ createdAt: '2024-01-01' }))
    expect(messages).toContain(
      '@Solverse/WorkingHours: createdAt must be a valid Date instance',
    )
  })

  it('rejects null', () => {
    const messages = getMessages(with_({ createdAt: null }))
    expect(messages).toContain(
      '@Solverse/WorkingHours: createdAt must be a valid Date instance',
    )
  })
})

describe('WorkingHoursSchema — createdBy', () => {
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
    // NullOr annotation does not override; inner UserId message surfaces
    expect(messages).toContain(
      '@Solverse/User: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })
})

describe('WorkingHoursSchema — updatedAt', () => {
  it('rejects a date string instead of a Date instance', () => {
    const messages = getMessages(with_({ updatedAt: '2024-01-01' }))
    expect(messages).toContain(
      '@Solverse/WorkingHours: updatedAt must be a valid Date instance',
    )
  })
})

describe('WorkingHoursSchema — updatedBy', () => {
  it('rejects a non-UUID string', () => {
    const messages = getMessages(with_({ updatedBy: 'bad-id' }))
    expect(messages).toContain(
      '@Solverse/User: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })
})

describe('WorkingHoursSchema — deletedAt', () => {
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

describe('WorkingHoursSchema — deletedBy', () => {
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

describe('WorkingHoursSchema — isDeleted', () => {
  it('rejects a string instead of boolean', () => {
    const messages = getMessages(with_({ isDeleted: 'false' }))
    expect(messages).toContain('@Solverse/WorkingHours: isDeleted must be a boolean')
  })

  it('rejects a number instead of boolean', () => {
    const messages = getMessages(with_({ isDeleted: 0 }))
    expect(messages).toContain('@Solverse/WorkingHours: isDeleted must be a boolean')
  })
})
