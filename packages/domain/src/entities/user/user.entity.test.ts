import { describe, expect, it } from 'vitest'
import { ParseResult, Schema } from 'effect'
import { UserSchema } from './user.entity'

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

/**
 * Decodes `input` through `UserSchema` synchronously and returns the list of
 * validation-message strings produced by Effect's ArrayFormatter — the same
 * format used by `decodeOrFail` at runtime.
 *
 * Returns an empty array when the input is valid.
 */
const getMessages = (input: unknown): string[] => {
  try {
    Schema.decodeUnknownSync(UserSchema)(input)
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

const validUser: unknown = {
  id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  username: 'john_doe',
  password: '$2b$12$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012345',
  name: { firstName: 'John', lastName: 'Doe' },
  email: 'john@example.com',
  phone: null,
  role: 'businessOwner',
  status: 'active',
  timezone: 'America/New_York',
  avatarUrl: null,
  emailVerified: true,
  notificationPreferences: { email: true, sms: false, push: false },
  lastLoginAt: null,
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
  ...(validUser as object),
  ...overrides,
})

// ---------------------------------------------------------------------------
// Sanity check — valid input produces no errors
// ---------------------------------------------------------------------------

describe('UserSchema — valid input', () => {
  it('accepts a fully valid user object', () => {
    expect(getMessages(validUser)).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// id
// ---------------------------------------------------------------------------

describe('UserSchema — id', () => {
  it('rejects a non-UUID string', () => {
    const messages = getMessages(with_({ id: 'not-a-uuid' }))
    expect(messages).toContain(
      '@Solverse/User: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })

  it('rejects a UUID v1 (wrong version digit)', () => {
    const messages = getMessages(
      with_({ id: '123e4567-e89b-12d3-a456-426614174000' }),
    )
    expect(messages).toContain(
      '@Solverse/User: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })

  it('rejects a UUID without dashes', () => {
    const messages = getMessages(
      with_({ id: 'f47ac10b58cc4372a5670e02b2c3d479' }),
    )
    expect(messages).toContain(
      '@Solverse/User: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })
})

// ---------------------------------------------------------------------------
// username
// ---------------------------------------------------------------------------

describe('UserSchema — username', () => {
  it('rejects a username starting with an underscore', () => {
    const messages = getMessages(with_({ username: '_invalid' }))
    expect(messages).toContain(
      '@Solverse/User: username must be 3–30 lowercase alphanumeric characters; underscores or hyphens allowed but not at start or end (e.g. "john_doe")',
    )
  })

  it('rejects a username that is too short (< 3 chars)', () => {
    const messages = getMessages(with_({ username: 'ab' }))
    expect(messages).toContain(
      '@Solverse/User: username must be 3–30 lowercase alphanumeric characters; underscores or hyphens allowed but not at start or end (e.g. "john_doe")',
    )
  })

  it('rejects a username containing spaces', () => {
    const messages = getMessages(with_({ username: 'john doe' }))
    expect(messages).toContain(
      '@Solverse/User: username must be 3–30 lowercase alphanumeric characters; underscores or hyphens allowed but not at start or end (e.g. "john_doe")',
    )
  })

  it('rejects a username with uppercase letters', () => {
    const messages = getMessages(with_({ username: 'JohnDoe' }))
    expect(messages).toContain(
      '@Solverse/User: username must be 3–30 lowercase alphanumeric characters; underscores or hyphens allowed but not at start or end (e.g. "john_doe")',
    )
  })
})

// ---------------------------------------------------------------------------
// password
// ---------------------------------------------------------------------------

describe('UserSchema — password', () => {
  it('rejects an empty password string', () => {
    const messages = getMessages(with_({ password: '' }))
    expect(messages).toContain(
      '@Solverse/User: password must be a non-empty hashed password string (bcrypt/argon2)',
    )
  })
})

// ---------------------------------------------------------------------------
// name
// ---------------------------------------------------------------------------

describe('UserSchema — name', () => {
  it('rejects a non-object name value', () => {
    const messages = getMessages(with_({ name: 'John Doe' }))
    expect(messages).toContain(
      '@Solverse/User: name must be an object with non-empty firstName and lastName (max 50 characters each)',
    )
  })

  it('rejects an empty firstName', () => {
    const messages = getMessages(
      with_({ name: { firstName: '', lastName: 'Doe' } }),
    )
    expect(messages).toContain('@Solverse/User: firstName must not be empty')
  })

  it('rejects an empty lastName', () => {
    const messages = getMessages(
      with_({ name: { firstName: 'John', lastName: '' } }),
    )
    expect(messages).toContain('@Solverse/User: lastName must not be empty')
  })

  it('rejects a firstName exceeding 50 characters', () => {
    const messages = getMessages(
      with_({ name: { firstName: 'A'.repeat(51), lastName: 'Doe' } }),
    )
    expect(messages).toContain(
      '@Solverse/User: firstName must be at most 50 characters',
    )
  })

  it('rejects a lastName exceeding 50 characters', () => {
    const messages = getMessages(
      with_({ name: { firstName: 'John', lastName: 'D'.repeat(51) } }),
    )
    expect(messages).toContain(
      '@Solverse/User: lastName must be at most 50 characters',
    )
  })
})

// ---------------------------------------------------------------------------
// email
// ---------------------------------------------------------------------------

describe('UserSchema — email', () => {
  it('rejects a plain string without @', () => {
    const messages = getMessages(with_({ email: 'plainstring' }))
    expect(messages).toContain(
      '@Solverse/User: email must be a valid lowercase email address (e.g. "user@example.com")',
    )
  })

  it('rejects an email missing the domain TLD', () => {
    const messages = getMessages(with_({ email: 'user@nodomain' }))
    expect(messages).toContain(
      '@Solverse/User: email must be a valid lowercase email address (e.g. "user@example.com")',
    )
  })

  it('rejects an email with spaces', () => {
    const messages = getMessages(with_({ email: 'user name@example.com' }))
    expect(messages).toContain(
      '@Solverse/User: email must be a valid lowercase email address (e.g. "user@example.com")',
    )
  })
})

// ---------------------------------------------------------------------------
// phone
// ---------------------------------------------------------------------------

describe('UserSchema — phone', () => {
  it('accepts null', () => {
    expect(getMessages(with_({ phone: null }))).toEqual([])
  })

  it('rejects a phone not starting with +', () => {
    const messages = getMessages(with_({ phone: '12025551234' }))
    // Effect surfaces the inner UserPhoneNumber pattern message for the failing union branch
    expect(messages).toContain(
      '@Solverse/User: phone must be a valid E.164 number (e.g. "+12025551234") — must start with + followed by 8–15 digits',
    )
  })

  it('rejects a phone that is too short after +', () => {
    const messages = getMessages(with_({ phone: '+123' }))
    expect(messages).toContain(
      '@Solverse/User: phone must be a valid E.164 number (e.g. "+12025551234") — must start with + followed by 8–15 digits',
    )
  })
})

// ---------------------------------------------------------------------------
// role
// ---------------------------------------------------------------------------

describe('UserSchema — role', () => {
  it('rejects an unknown role string', () => {
    const messages = getMessages(with_({ role: 'admin' }))
    expect(messages).toContain(
      '@Solverse/User: role must be one of "superAdmin", "businessOwner", or "locationOwner"',
    )
  })

  it('rejects an empty role string', () => {
    const messages = getMessages(with_({ role: '' }))
    expect(messages).toContain(
      '@Solverse/User: role must be one of "superAdmin", "businessOwner", or "locationOwner"',
    )
  })
})

// ---------------------------------------------------------------------------
// status
// ---------------------------------------------------------------------------

describe('UserSchema — status', () => {
  it('rejects an unknown status string', () => {
    const messages = getMessages(with_({ status: 'banned' }))
    expect(messages).toContain(
      '@Solverse/User: status must be one of "pending_verification", "active", "inactive", or "suspended"',
    )
  })

  it('rejects an empty status string', () => {
    const messages = getMessages(with_({ status: '' }))
    expect(messages).toContain(
      '@Solverse/User: status must be one of "pending_verification", "active", "inactive", or "suspended"',
    )
  })
})

// ---------------------------------------------------------------------------
// timezone
// ---------------------------------------------------------------------------

describe('UserSchema — timezone', () => {
  it('rejects an invalid IANA timezone string', () => {
    const messages = getMessages(with_({ timezone: 'Not/ATimezone' }))
    expect(messages).toContain(
      '@Solverse/User: timezone must be a valid IANA timezone identifier (e.g. "America/New_York")',
    )
  })

  it('rejects an empty timezone string (minLength fires before IANA filter)', () => {
    const messages = getMessages(with_({ timezone: '' }))
    // minLength(1) is checked before the IANA Intl filter, so the generic
    // length message surfaces rather than the IANA-specific one
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('at least 1 character')]),
    )
  })
})

// ---------------------------------------------------------------------------
// avatarUrl
// ---------------------------------------------------------------------------

describe('UserSchema — avatarUrl', () => {
  it('accepts null', () => {
    expect(getMessages(with_({ avatarUrl: null }))).toEqual([])
  })

  it('accepts a valid https URL', () => {
    expect(
      getMessages(with_({ avatarUrl: 'https://cdn.example.com/avatar.png' })),
    ).toEqual([])
  })

  it('rejects an ftp URL', () => {
    const messages = getMessages(
      with_({ avatarUrl: 'ftp://files.example.com/avatar.png' }),
    )
    // The NullOr annotation does not override inner messages; Effect returns
    // the raw pattern message from String.pipe(Schema.pattern(/^https?:\/\//))
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('matching the pattern')]),
    )
  })

  it('rejects a plain string', () => {
    const messages = getMessages(with_({ avatarUrl: 'not-a-url' }))
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('matching the pattern')]),
    )
  })
})

// ---------------------------------------------------------------------------
// emailVerified
// ---------------------------------------------------------------------------

describe('UserSchema — emailVerified', () => {
  it('rejects a string instead of boolean', () => {
    const messages = getMessages(with_({ emailVerified: 'yes' }))
    expect(messages).toContain(
      '@Solverse/User: emailVerified must be a boolean',
    )
  })

  it('rejects a number instead of boolean', () => {
    const messages = getMessages(with_({ emailVerified: 1 }))
    expect(messages).toContain(
      '@Solverse/User: emailVerified must be a boolean',
    )
  })
})

// ---------------------------------------------------------------------------
// notificationPreferences
// ---------------------------------------------------------------------------

describe('UserSchema — notificationPreferences', () => {
  it('rejects a non-object value', () => {
    const messages = getMessages(with_({ notificationPreferences: true }))
    expect(messages).toContain(
      '@Solverse/User: notificationPreferences must be an object with boolean fields: email, sms, and push',
    )
  })

  it('rejects a non-boolean email preference', () => {
    const messages = getMessages(
      with_({
        notificationPreferences: { email: 'yes', sms: false, push: false },
      }),
    )
    expect(messages).toContain(
      '@Solverse/User: notificationPreferences.email must be a boolean',
    )
  })

  it('rejects a non-boolean sms preference', () => {
    const messages = getMessages(
      with_({ notificationPreferences: { email: true, sms: 1, push: false } }),
    )
    expect(messages).toContain(
      '@Solverse/User: notificationPreferences.sms must be a boolean',
    )
  })

  it('rejects a non-boolean push preference', () => {
    const messages = getMessages(
      with_({
        notificationPreferences: { email: true, sms: false, push: null },
      }),
    )
    expect(messages).toContain(
      '@Solverse/User: notificationPreferences.push must be a boolean',
    )
  })
})

// ---------------------------------------------------------------------------
// lastLoginAt
// ---------------------------------------------------------------------------

describe('UserSchema — lastLoginAt', () => {
  it('accepts null', () => {
    expect(getMessages(with_({ lastLoginAt: null }))).toEqual([])
  })

  it('accepts a Date instance', () => {
    expect(getMessages(with_({ lastLoginAt: new Date() }))).toEqual([])
  })

  it('rejects a date string instead of a Date instance', () => {
    const messages = getMessages(
      with_({ lastLoginAt: '2024-01-01T00:00:00.000Z' }),
    )
    // NullOr annotation does not override inner DateFromSelf message
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('DateFromSelf')]),
    )
  })
})

// ---------------------------------------------------------------------------
// suspendedReason
// ---------------------------------------------------------------------------

describe('UserSchema — suspendedReason', () => {
  it('accepts null', () => {
    expect(getMessages(with_({ suspendedReason: null }))).toEqual([])
  })

  it('accepts a string reason', () => {
    expect(
      getMessages(with_({ suspendedReason: 'Violated terms of service' })),
    ).toEqual([])
  })

  it('rejects a number instead of string or null', () => {
    const messages = getMessages(with_({ suspendedReason: 42 }))
    // NullOr annotation does not override inner messages; Effect returns raw
    // "Expected string" and "Expected null" messages for each union branch
    expect(messages).toEqual(
      expect.arrayContaining([expect.stringContaining('Expected string')]),
    )
  })
})

// ---------------------------------------------------------------------------
// Audit fields
// ---------------------------------------------------------------------------

describe('UserSchema — createdAt', () => {
  it('rejects a date string instead of a Date instance', () => {
    const messages = getMessages(with_({ createdAt: '2024-01-01' }))
    expect(messages).toContain(
      '@Solverse/User: createdAt must be a valid Date instance',
    )
  })

  it('rejects null', () => {
    const messages = getMessages(with_({ createdAt: null }))
    expect(messages).toContain(
      '@Solverse/User: createdAt must be a valid Date instance',
    )
  })
})

describe('UserSchema — createdBy', () => {
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
    // The NullOr annotation does not override the inner UserId message;
    // Effect surfaces UserId's own pattern message for the failing branch
    expect(messages).toContain(
      '@Solverse/User: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })
})

describe('UserSchema — updatedAt', () => {
  it('rejects a date string instead of a Date instance', () => {
    const messages = getMessages(with_({ updatedAt: '2024-01-01' }))
    expect(messages).toContain(
      '@Solverse/User: updatedAt must be a valid Date instance',
    )
  })
})

describe('UserSchema — updatedBy', () => {
  it('rejects a non-UUID string', () => {
    const messages = getMessages(with_({ updatedBy: 'bad-id' }))
    expect(messages).toContain(
      '@Solverse/User: id must be a valid UUID v4 (e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479")',
    )
  })
})

describe('UserSchema — deletedAt', () => {
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

describe('UserSchema — deletedBy', () => {
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

describe('UserSchema — isDeleted', () => {
  it('rejects a string instead of boolean', () => {
    const messages = getMessages(with_({ isDeleted: 'false' }))
    expect(messages).toContain('@Solverse/User: isDeleted must be a boolean')
  })

  it('rejects a number instead of boolean', () => {
    const messages = getMessages(with_({ isDeleted: 0 }))
    expect(messages).toContain('@Solverse/User: isDeleted must be a boolean')
  })
})
