import { Effect, Schema } from 'effect'
import type { ParseError } from 'effect/ParseResult'
import { UserId } from '../user/entry'
import { Timezone, Email, PhoneNumber } from '../common/entry'
import {
  BusinessId,
  BusinessName,
  BusinessPlan,
  BusinessSlug,
  BusinessStatus,
  BusinessCurrency,
} from './entry'
import {
  BusinessAlreadyActiveError,
  BusinessDeletedError,
  BusinessSuspendedError,
  InvalidBusinessTransitionError,
} from './errors/entry'
import type { BusinessData } from './business.entity'
import { BusinessSchema } from './business.entity'

/**
 * Business aggregate root for the appointment scheduling domain.
 *
 * Represents a tenant — the top-level entity that owns locations, staff,
 * services, and appointments. Enforces all lifecycle and plan invariants.
 *
 * Instances are always valid — the private constructor prevents constructing
 * a Business without going through `Business.create` or `Business.fromRaw`.
 *
 * All mutation methods return a new `Business` instance (immutable updates)
 * and wrap fallible operations in `Effect` with typed errors.
 *
 * @example
 * const biz = Business.create({ id, ownerId, name, slug, email, timezone })
 * const active = yield* biz.activate()
 */
export class Business {
  private constructor(private readonly data: BusinessData) {}

  // ── Identity ───────────────────────────────────────────────────────────────

  /** Unique identifier for this business. */
  get id(): BusinessId {
    return this.data.id
  }

  /** UserId of the owner — must hold the `businessOwner` role. */
  get ownerId(): UserId {
    return this.data.ownerId
  }

  /** Public display name. */
  get name(): BusinessName {
    return this.data.name
  }

  /** URL-safe slug used in booking links: `/<slug>/book`. */
  get slug(): BusinessSlug {
    return this.data.slug
  }

  /** Primary contact email for the business. */
  get email(): Email {
    return this.data.email
  }

  /** Optional E.164-formatted contact phone number. */
  get phone(): PhoneNumber | null {
    return this.data.phone
  }

  /** Default IANA timezone — used when no location overrides it. */
  get timezone(): Timezone {
    return this.data.timezone
  }

  /** Current lifecycle status. */
  get status(): BusinessStatus {
    return this.data.status
  }

  /** Subscription plan governing feature access and usage limits. */
  get plan(): BusinessPlan {
    return this.data.plan
  }

  /** ISO 4217 currency code used for all services on this business's booking page. */
  get currency(): BusinessCurrency {
    return this.data.currency
  }

  /** Whether this business has been soft-deleted. */
  get isDeleted(): boolean {
    return this.data.isDeleted
  }

  // ── Factory ────────────────────────────────────────────────────────────────

  /**
   * Creates a brand-new Business with safe defaults.
   *
   * - Status is set to `pending_verification`
   * - Plan defaults to `free`
   * - Audit fields are initialised; `createdBy` is the owner
   * - `isDeleted` defaults to `false`
   *
   * @param params - Required fields to initialize the business
   */
  static create(params: {
    id: BusinessId
    ownerId: UserId
    name: BusinessName
    slug: BusinessSlug
    email: Email
    timezone: Timezone
    currency: BusinessCurrency
    phone?: PhoneNumber
    plan?: BusinessPlan
  }): Business {
    const now = new Date()
    return new Business({
      id: params.id,
      ownerId: params.ownerId,
      name: params.name,
      slug: params.slug,
      email: params.email,
      phone: params.phone ?? null,
      timezone: params.timezone,
      status: 'pending_verification',
      plan: params.plan ?? 'free',
      currency: params.currency,
      logoUrl: null,
      description: null,
      website: null,
      suspendedReason: null,
      createdAt: now,
      createdBy: params.ownerId,
      updatedAt: now,
      updatedBy: params.ownerId,
      deletedAt: null,
      deletedBy: null,
      isDeleted: false,
    })
  }

  /**
   * Reconstitutes a Business from raw untrusted data (e.g. database row, API payload).
   *
   * Decodes and validates the input against `BusinessSchema`. Use this at system
   * boundaries only — never deep inside domain or application logic.
   *
   * @returns `Effect<Business, ParseError>` — fails with a structured parse error if invalid
   */
  static fromRaw(raw: unknown): Effect.Effect<Business, ParseError, never> {
    return Schema.decodeUnknown(BusinessSchema)(raw).pipe(
      Effect.map((data) => new Business(data)),
    )
  }

  // ── Behaviour ──────────────────────────────────────────────────────────────

  /**
   * Transitions the business from `pending_verification` to `active`.
   *
   * Called after the owner confirms their email and the business is
   * ready to accept bookings.
   *
   * @param updatedBy - Actor performing the activation
   * @fails `BusinessAlreadyActiveError`   — if already active
   * @fails `InvalidBusinessTransitionError` — if suspended or inactive
   */
  activate(
    updatedBy: UserId,
  ): Effect.Effect<
    Business,
    BusinessAlreadyActiveError | InvalidBusinessTransitionError
  > {
    if (this.data.isDeleted) {
      return Effect.fail(
        new InvalidBusinessTransitionError({
          message: 'Cannot activate a deleted business',
          cause: 'Cannot activate a deleted business',
        }),
      )
    }
    if (this.data.status === 'active') {
      return Effect.fail(
        new BusinessAlreadyActiveError({
          message: `Business "${this.data.name}" is already active`,
          cause: `Business "${this.data.name}" is already active`,
        }),
      )
    }
    if (this.data.status === 'suspended' || this.data.status === 'inactive') {
      return Effect.fail(
        new InvalidBusinessTransitionError({
          message: `Cannot activate a ${this.data.status} business — use reactivate() instead`,
          cause: `Cannot activate a ${this.data.status} business — use reactivate() instead`,
        }),
      )
    }
    return Effect.succeed(
      new Business({
        ...this.data,
        status: 'active',
        updatedAt: new Date(),
        updatedBy,
      }),
    )
  }

  /**
   * Voluntarily pauses the business — stops accepting new bookings.
   *
   * Only allowed from `active` status. Existing appointments are not affected.
   *
   * @param updatedBy - Actor performing the deactivation (typically the owner)
   * @fails `InvalidBusinessTransitionError` — if already inactive or suspended
   */
  deactivate(
    updatedBy: UserId,
  ): Effect.Effect<Business, InvalidBusinessTransitionError> {
    if (this.data.isDeleted) {
      return Effect.fail(
        new InvalidBusinessTransitionError({
          message: 'Cannot deactivate a deleted business',
          cause: 'Cannot deactivate a deleted business',
        }),
      )
    }
    if (this.data.status === 'inactive') {
      return Effect.fail(
        new InvalidBusinessTransitionError({
          message: `Business "${this.data.name}" is already inactive`,
          cause: `Business "${this.data.name}" is already inactive`,
        }),
      )
    }
    if (this.data.status === 'suspended') {
      return Effect.fail(
        new InvalidBusinessTransitionError({
          message: `Cannot deactivate a suspended business — lift the suspension first`,
          cause: `Cannot deactivate a suspended business — lift the suspension first`,
        }),
      )
    }
    return Effect.succeed(
      new Business({
        ...this.data,
        status: 'inactive',
        updatedAt: new Date(),
        updatedBy,
      }),
    )
  }

  /**
   * Administratively suspends the business with a mandatory reason.
   *
   * A suspended business cannot accept bookings or be managed by the owner
   * until the suspension is lifted by an admin.
   *
   * @param reason    - Human-readable explanation for the suspension
   * @param updatedBy - Admin actor performing the suspension
   * @fails `InvalidBusinessTransitionError` — if already suspended
   * @fails `BusinessDeletedError`           — if soft-deleted
   */
  suspend(
    reason: string,
    updatedBy: UserId,
  ): Effect.Effect<
    Business,
    InvalidBusinessTransitionError | BusinessDeletedError
  > {
    if (this.data.isDeleted) {
      return Effect.fail(
        new BusinessDeletedError({
          message: 'Cannot suspend a deleted business',
          cause: 'Cannot suspend a deleted business',
        }),
      )
    }
    if (this.data.status === 'suspended') {
      return Effect.fail(
        new InvalidBusinessTransitionError({
          message: `Business "${this.data.name}" is already suspended`,
          cause: `Business "${this.data.name}" is already suspended`,
        }),
      )
    }
    return Effect.succeed(
      new Business({
        ...this.data,
        status: 'suspended',
        suspendedReason: reason,
        updatedAt: new Date(),
        updatedBy,
      }),
    )
  }

  /**
   * Restores an inactive or suspended business back to `active` status.
   *
   * Clears any suspension reason on reactivation.
   *
   * @param updatedBy - Actor lifting the suspension or reactivating
   * @fails `InvalidBusinessTransitionError` — if not inactive or suspended
   * @fails `BusinessDeletedError`           — if soft-deleted
   */
  reactivate(
    updatedBy: UserId,
  ): Effect.Effect<
    Business,
    InvalidBusinessTransitionError | BusinessDeletedError
  > {
    if (this.data.isDeleted) {
      return Effect.fail(
        new BusinessDeletedError({
          message: 'Cannot reactivate a deleted business',
          cause: 'Cannot reactivate a deleted business',
        }),
      )
    }
    if (this.data.status !== 'inactive' && this.data.status !== 'suspended') {
      return Effect.fail(
        new InvalidBusinessTransitionError({
          message: `Business "${this.data.name}" is not inactive or suspended`,
          cause: `Business "${this.data.name}" is not inactive or suspended`,
        }),
      )
    }
    return Effect.succeed(
      new Business({
        ...this.data,
        status: 'active',
        suspendedReason: null,
        updatedAt: new Date(),
        updatedBy,
      }),
    )
  }

  /**
   * Soft-deletes the business.
   *
   * Sets `isDeleted = true`, records `deletedAt` and `deletedBy`.
   * All further mutations on a deleted business will fail.
   * Data is retained in the database for audit purposes.
   *
   * @param deletedBy - Actor performing the deletion
   * @fails `BusinessDeletedError` — if already soft-deleted
   */
  softDelete(deletedBy: UserId): Effect.Effect<Business, BusinessDeletedError> {
    if (this.data.isDeleted) {
      return Effect.fail(
        new BusinessDeletedError({
          message: `Business "${this.data.name}" has already been deleted`,
          cause: `Business "${this.data.name}" has already been deleted`,
        }),
      )
    }
    const now = new Date()
    return Effect.succeed(
      new Business({
        ...this.data,
        isDeleted: true,
        deletedAt: now,
        deletedBy,
        updatedAt: now,
        updatedBy: deletedBy,
      }),
    )
  }

  /**
   * Changes the subscription plan.
   *
   * Downgrading to `free` from a paid plan is allowed — enforcement
   * of limits (locations, staff, etc.) is the application layer's responsibility.
   *
   * @param plan      - The new subscription plan
   * @param updatedBy - Actor making the change
   * @fails `BusinessDeletedError`           — if soft-deleted
   * @fails `BusinessSuspendedError`         — if suspended
   */
  changePlan(
    plan: BusinessPlan,
    updatedBy: UserId,
  ): Effect.Effect<Business, BusinessDeletedError | BusinessSuspendedError> {
    if (this.data.isDeleted) {
      return Effect.fail(
        new BusinessDeletedError({
          message: 'Cannot change the plan of a deleted business',
          cause: 'Cannot change the plan of a deleted business',
        }),
      )
    }
    if (this.data.status === 'suspended') {
      return Effect.fail(
        new BusinessSuspendedError({
          message: `Cannot change the plan of a suspended business`,
          cause: `Cannot change the plan of a suspended business`,
        }),
      )
    }
    return Effect.succeed(
      new Business({
        ...this.data,
        plan,
        updatedAt: new Date(),
        updatedBy,
      }),
    )
  }

  /**
   * Updates the public booking URL slug.
   *
   * Uniqueness is NOT enforced here — the caller (application/repository layer)
   * must verify the slug is not already taken before calling this method.
   *
   * @param slug      - The new validated slug
   * @param updatedBy - Actor making the change
   * @fails `BusinessDeletedError` — if soft-deleted
   */
  updateSlug(
    slug: BusinessSlug,
    updatedBy: UserId,
  ): Effect.Effect<Business, BusinessDeletedError> {
    if (this.data.isDeleted) {
      return Effect.fail(
        new BusinessDeletedError({
          message: 'Cannot update the slug of a deleted business',
          cause: 'Cannot update the slug of a deleted business',
        }),
      )
    }
    return Effect.succeed(
      new Business({
        ...this.data,
        slug,
        updatedAt: new Date(),
        updatedBy,
      }),
    )
  }

  /**
   * Updates the public-facing profile fields.
   *
   * Only provided keys are overwritten — omitted keys remain unchanged.
   *
   * @param profile   - Partial profile fields to apply
   * @param updatedBy - Actor making the change
   * @fails `BusinessDeletedError` — if soft-deleted
   */
  updateProfile(
    profile: Partial<{
      name: BusinessName
      description: string | null
      website: string | null
      logoUrl: string | null
      phone: PhoneNumber | null
      timezone: Timezone
      email: Email
      currency: BusinessCurrency
    }>,
    updatedBy: UserId,
  ): Effect.Effect<Business, BusinessDeletedError> {
    if (this.data.isDeleted) {
      return Effect.fail(
        new BusinessDeletedError({
          message: 'Cannot update a deleted business',
          cause: 'Cannot update a deleted business',
        }),
      )
    }
    return Effect.succeed(
      new Business({
        ...this.data,
        ...profile,
        updatedAt: new Date(),
        updatedBy,
      }),
    )
  }

  // ── Serialization ──────────────────────────────────────────────────────────

  /**
   * Returns the plain data object for persistence or event emission.
   * Use `Business.fromRaw` to reconstitute back into an aggregate.
   */
  toRaw(): BusinessData {
    return this.data
  }
}
