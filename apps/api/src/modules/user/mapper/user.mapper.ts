import { User } from '@solverse/domain'
import { UserApi } from '@solverse/shared'

export class UserMapper {
  static userAggregateToResponse(user: User): UserApi.GetUser.Response {
    const data = user.toRaw()
    return {
      id: data.id,
      username: data.username,
      name: { firstName: data.name.firstName, lastName: data.name.lastName },
      email: data.email,
      phone: data.phone,
      role: data.role,
      status: data.status,
      timezone: data.timezone,
      avatarUrl: data.avatarUrl,
      emailVerified: data.emailVerified,
      notificationPreferences: {
        email: data.notificationPreferences.email,
        sms: data.notificationPreferences.sms,
        push: data.notificationPreferences.push,
      },
      lastLoginAt: data.lastLoginAt ? data.lastLoginAt.toISOString() : null,
      createdAt: data.createdAt.toISOString(),
    }
  }
}
