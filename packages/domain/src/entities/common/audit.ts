import { Schema } from 'effect'
import { UserId } from '../user/value-objects/user.id'

/**
 * Shared audit fields mixed into every entity schema.
 *
 * Spread these fields into any `Schema.Struct` via `...AuditSchema.fields`
 * to guarantee consistent tracking across all domain entities.
 *
 * - `createdAt`  / `createdBy`  — set once on insert, never mutated
 * - `updatedAt`  / `updatedBy`  — refreshed on every write
 * - `deletedAt`  / `deletedBy`  — set on soft-delete, null otherwise
 * - `isDeleted`                 — fast filter flag; always check this before returning records
 */
export const AuditSchema = Schema.Struct({
  /** Timestamp when the record was first created */
  createdAt: Schema.DateFromSelf,
  /** UserId of the actor who created the record, or null for system-generated records */
  createdBy: Schema.NullOr(UserId),
  /** Timestamp of the most recent update to any field */
  updatedAt: Schema.DateFromSelf,
  /** UserId of the actor who last updated the record, or null for system-generated updates */
  updatedBy: Schema.NullOr(UserId),
  /** Timestamp when the record was soft-deleted, or null if not deleted */
  deletedAt: Schema.NullOr(Schema.DateFromSelf),
  /** UserId of the actor who soft-deleted the record, or null if not deleted */
  deletedBy: Schema.NullOr(UserId),
  /** Whether the record has been soft-deleted — always filter on this before returning data */
  isDeleted: Schema.Boolean,
})

export type AuditData = typeof AuditSchema.Type
