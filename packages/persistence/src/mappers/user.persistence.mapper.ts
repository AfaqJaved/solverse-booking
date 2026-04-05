import { Effect } from 'effect'
import { User } from '@solverse/domain'
import type { UserRow, UserInsertRow } from '../schema/user.table'
import { PersistenceMappingError } from '@solverse/domain'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UserPersistenceMapper {
  /**
   * Maps a raw database row to a validated User domain aggregate.
   * Fails with UserPersistenceMappingError if the row data doesn't satisfy domain invariants.
   */
  toDomain(row: UserRow): Effect.Effect<User, PersistenceMappingError, never> {
    return User.fromSchema({
      id: row.id,
      username: row.username,
      password: row.password,
      name: { firstName: row.firstName, lastName: row.lastName },
      email: row.email,
      phone: row.phone ?? null,
      role: row.role,
      status: row.status,
      timezone: row.timezone,
      avatarUrl: row.avatarUrl ?? null,
      emailVerified: row.emailVerified,
      notificationPreferences: row.notificationPreferences,
      createdAt: row.createdAt,
      createdBy: row.createdBy ?? null,
      updatedAt: row.updatedAt,
      updatedBy: row.updatedBy ?? null,
      deletedAt: row.deletedAt ?? null,
      deletedBy: row.deletedBy ?? null,
      isDeleted: row.isDeleted ?? false,
      lastLoginAt: row.lastLoginAt ?? null,
      suspendedReason: row.suspendedReason ?? null,
    }).pipe(
      Effect.mapError(
        (cause) =>
          new PersistenceMappingError({
            message: 'Failed to map User (Persistence -> )',
            cause,
          }),
      ),
    )
  }

  /**
   * Maps a User domain aggregate to a database insert/update row.
   * Always succeeds — domain data is guaranteed valid by the aggregate invariants.
   */
  toPersistence(user: User): UserInsertRow {
    const data = user.toRaw()
    return {
      id: data.id,
      username: data.username,
      password: data.password,
      firstName: data.name.firstName,
      lastName: data.name.lastName,
      email: data.email,
      phone: data.phone ?? null,
      role: data.role,
      status: data.status,
      timezone: data.timezone,
      avatarUrl: data.avatarUrl ?? null,
      emailVerified: data.emailVerified,
      notificationPreferences: data.notificationPreferences,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      lastLoginAt: data.lastLoginAt ?? null,
      suspendedReason: data.suspendedReason ?? null,
    }
  }
}
