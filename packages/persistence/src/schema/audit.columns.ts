import { boolean, timestamp, uuid } from 'drizzle-orm/pg-core'

/**
 * Shared audit column definitions — mirrors `AuditSchema` from `@solverse/domain`.
 *
 * Actor ID columns (createdBy, updatedBy, deletedBy) are plain UUIDs with no FK
 * constraint — audit trails should not block user deletion or create cross-table
 * referential integrity issues.
 *
 * @example
 * import { auditColumns } from './audit.columns'
 *
 * const myTable = pgTable('my_table', {
 *   id: uuid('id').primaryKey(),
 *   ...auditColumns,
 * })
 */
export const auditColumns = {
  /** Timestamp when the record was first created */
  createdAt: timestamp('created_at').notNull().defaultNow(),

  /** UUID of the actor who created the record, null for system-generated */
  createdBy: uuid('created_by'),

  /** Timestamp of the most recent update to any field */
  updatedAt: timestamp('updated_at').notNull().defaultNow(),

  /** UUID of the actor who last updated the record, null for system-generated */
  updatedBy: uuid('updated_by'),

  /** Timestamp when the record was soft-deleted, null if not deleted */
  deletedAt: timestamp('deleted_at'),

  /** UUID of the actor who soft-deleted the record, null if not deleted */
  deletedBy: uuid('deleted_by'),

  /** Whether the record has been soft-deleted — always filter on this before returning data */
  isDeleted: boolean('is_deleted').notNull().default(false),
}
