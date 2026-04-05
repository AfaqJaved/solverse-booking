import { Effect, Schema } from 'effect'
import type { ParseError } from 'effect/ParseResult'
import {
  NotificationPreferences,
  UserStatus,
  UserId,
  getDisplayName,
  FullName,
  Username,
  HashedPassword,
} from './entry'
import {
  UserSuspendedError,
  InvalidUserTransitionError,
  EmailNotVerifiedError,
  UserAlreadyActiveError,
} from './entry'
import type { UserData } from './user.entity'
import { UserSchema } from './user.entity'
import { UserEmail } from './value-objects/email'
import { UserPhoneNumber } from './value-objects/phone.number'
import { UserTimezone } from './value-objects/timezone'

/**
 * User aggregate root for the appointment scheduling domain.
 *
 * Encapsulates all user-related state and enforces domain invariants.
 * Instances are always valid — the private constructor prevents constructing
 * a User without going through `User.create` or `User.fromRaw`.
 *
 * All mutation methods return a new `User` instance (immutable updates)
 * and wrap fallible operations in `Effect` with typed errors.
 *
 * @example
 * const user = User.create({ id, name, email, role: "businessOwner", timezone })
 * const activated = yield* user.verifyEmail().pipe(Effect.flatMap(u => u.activate()))
 */
export class User {
  private constructor(private readonly data: UserData) {}

  // ── Identity ───────────────────────────────────────────────────────────────

  /** Unique identifier for this user. */
  get id(): UserId {
    return this.data.id
  }

  /** Verified, lowercase email address. */
  get email(): UserEmail {
    return this.data.email
  }

  /** Role assigned to this user (superAdmin | businessOwner | locationOwner). */
  get role(): 'superAdmin' | 'businessOwner' | 'locationOwner' {
    return this.data.role
  }

  /** Current lifecycle status of the account. */
  get status(): UserStatus {
    return this.data.status
  }

  /** IANA timezone used for scheduling appointments in local time. */
  get timezone(): UserTimezone {
    return this.data.timezone
  }

  /** Full name formatted as "First Last". */
  get displayName(): string {
    return getDisplayName(this.data.name)
  }

  /** Whether the user has confirmed their email address. */
  get isEmailVerified(): boolean {
    return this.data.emailVerified
  }

  // ── Factory ────────────────────────────────────────────────────────────────

  /**
   * Creates a brand-new User with safe defaults.
   *
   * - Status is set to `pending_verification`
   * - Email is marked unverified
   * - Notification preferences default to email+push enabled, SMS disabled
   *
   * @param params - Required fields to initialize the user
   */
  static create(params: {
    id: UserId
    username: Username
    password: HashedPassword
    name: FullName
    email: UserEmail
    role: UserData['role']
    timezone: UserTimezone
    phone?: UserPhoneNumber
  }): User {
    const now = new Date()
    return new User({
      id: params.id,
      username: params.username,
      password: params.password,
      name: params.name,
      email: params.email,
      phone: params.phone ?? null,
      role: params.role,
      status: 'pending_verification',
      timezone: params.timezone,
      avatarUrl: null,
      emailVerified: false,
      notificationPreferences: { email: true, sms: false, push: true },
      createdAt: now,
      createdBy: params.id,
      updatedAt: now,
      updatedBy: params.id,
      deletedAt: null,
      deletedBy: null,
      isDeleted: false,
      lastLoginAt: null,
      suspendedReason: null,
    })
  }

  /**
   * Reconstitutes a User from raw untrusted data (e.g. database row, API payload).
   *
   * Decodes and validates the input against `UserSchema`. Use this at system
   * boundaries only — never deep inside domain or application logic.
   *
   * @returns `Effect<User, ParseError>` — fails with a structured parse error if the data is invalid
   */
  static fromRaw(raw: unknown): Effect.Effect<User, ParseError, never> {
    return Schema.decodeUnknown(UserSchema)(raw).pipe(
      Effect.map((data) => new User(data)),
    )
  }

  // ── Behavior ───────────────────────────────────────────────────────────────

  /**
   * Marks the user's email as verified.
   * Idempotent — succeeds without change if already verified.
   *
   * @returns The updated User with `emailVerified: true`
   */
  verifyEmail(): Effect.Effect<User, UserAlreadyActiveError> {
    if (this.data.emailVerified) {
      return Effect.succeed(this)
    }
    return Effect.succeed(
      new User({ ...this.data, emailVerified: true, updatedAt: new Date() }),
    )
  }

  /**
   * Transitions the user to `active` status.
   *
   * Requires email to be verified first. Fails if the user is already active.
   *
   * @fails `EmailNotVerifiedError` — if email has not been verified
   * @fails `InvalidUserTransitionError` — if already active
   */
  activate(): Effect.Effect<
    User,
    InvalidUserTransitionError | EmailNotVerifiedError
  > {
    if (!this.data.emailVerified) {
      return Effect.fail(
        new EmailNotVerifiedError({
          message: `Email not verified for the user ${this.data.email}`,
          cause: `Email not verified for the user ${this.data.email}`,
        }),
      )
    }
    if (this.data.status === 'active') {
      Effect.fail(
        new UserAlreadyActiveError({
          message: `User already is active`,
          cause: `User already is active`,
        }),
      )
    }
    return Effect.succeed(
      new User({ ...this.data, status: 'active', updatedAt: new Date() }),
    )
  }

  /**
   * Transitions the user to `inactive` status.
   *
   * Used when the user voluntarily deactivates their account.
   * Cannot deactivate an already-inactive or suspended user.
   *
   * @fails `InvalidUserTransitionError` — if already inactive or suspended
   */
  deactivate(): Effect.Effect<User, InvalidUserTransitionError> {
    if (this.data.status === 'inactive') {
      return Effect.fail(
        new InvalidUserTransitionError({
          message: `User can not perform this actions since it is inactive`,
          cause: `User can not perform this actions since it is inactive`,
        }),
      )
    }
    if (this.data.status === 'suspended') {
      return Effect.fail(
        new InvalidUserTransitionError({
          message: `User can not perform this actions since it is suspended`,
          cause: `User can not perform this actions since it is suspended`,
        }),
      )
    }
    return Effect.succeed(
      new User({ ...this.data, status: 'inactive', updatedAt: new Date() }),
    )
  }

  /**
   * Administratively suspends the user with a mandatory reason.
   *
   * A suspended user cannot book appointments or perform actions
   * that require an active account.
   *
   * @param reason - Human-readable explanation for the suspension
   * @fails `InvalidUserTransitionError` — if already suspended
   */
  suspend(reason: string): Effect.Effect<User, InvalidUserTransitionError> {
    if (this.data.status === 'suspended') {
      return Effect.fail(
        new InvalidUserTransitionError({
          message: `User can not perform this actions since it is suspended`,
          cause: `User can not perform this actions since it is suspended`,
        }),
      )
    }
    return Effect.succeed(
      new User({
        ...this.data,
        status: 'suspended',
        suspendedReason: reason,
        updatedAt: new Date(),
      }),
    )
  }

  /**
   * Restores an inactive or suspended user back to `active` status.
   *
   * Clears any suspension reason on reactivation.
   *
   * @fails `InvalidUserTransitionError` — if the user is not inactive or suspended
   */
  reactivate(): Effect.Effect<
    User,
    UserSuspendedError | InvalidUserTransitionError
  > {
    if (this.data.status !== 'inactive' && this.data.status !== 'suspended') {
      return Effect.fail(
        new InvalidUserTransitionError({
          message: `User can not perform this actions since it is already active `,
          cause: `User can not perform this actions since it is already active`,
        }),
      )
    }
    return Effect.succeed(
      new User({
        ...this.data,
        status: 'active',
        suspendedReason: null,
        updatedAt: new Date(),
      }),
    )
  }

  /**
   * Changes the user's email address.
   *
   * Resets `emailVerified` to `false` and status back to `pending_verification`
   * since ownership of the new address must be confirmed.
   *
   * @param newEmail - The new validated email address
   */
  changeEmail(newEmail: UserEmail): Effect.Effect<User, never> {
    return Effect.succeed(
      new User({
        ...this.data,
        email: newEmail,
        emailVerified: false,
        status: 'pending_verification',
        updatedAt: new Date(),
      }),
    )
  }

  /**
   * Updates or clears the user's phone number.
   *
   * @param phone - A valid E.164 phone number, or `null` to remove it
   */
  updatePhone(phone: UserPhoneNumber | null): User {
    return new User({ ...this.data, phone, updatedAt: new Date() })
  }

  /**
   * Updates the user's preferred IANA timezone.
   * Affects how appointment times are displayed and scheduled for this user.
   *
   * @param timezone - A valid IANA timezone identifier
   */
  updateTimezone(timezone: UserTimezone): User {
    return new User({ ...this.data, timezone, updatedAt: new Date() })
  }

  /**
   * Merges partial notification preference changes into the current preferences.
   * Only the provided keys are updated — unspecified channels remain unchanged.
   *
   * @param prefs - Partial notification preferences to apply
   */
  updateNotificationPreferences(prefs: Partial<NotificationPreferences>): User {
    return new User({
      ...this.data,
      notificationPreferences: {
        ...this.data.notificationPreferences,
        ...prefs,
      },
      updatedAt: new Date(),
    })
  }

  /**
   * Records the current timestamp as the user's most recent login.
   * Should be called by the application layer after successful authentication.
   */
  recordLogin(): User {
    return new User({ ...this.data, lastLoginAt: new Date() })
  }

  // ── Serialization ──────────────────────────────────────────────────────────

  /**
   * Returns the plain data object for persistence or event emission.
   * Use `User.fromRaw` to reconstitute back into an aggregate.
   */
  toRaw(): UserData {
    return this.data
  }
}
