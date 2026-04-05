import { ApiPropertyOptional } from '@nestjs/swagger'
import { UserApi } from '@solverse/shared'

export class NotificationPreferencesDto
  implements UserApi.UpdateProfile.NotificationPreferences
{
  @ApiPropertyOptional({ example: true })
  email?: boolean

  @ApiPropertyOptional({ example: false })
  sms?: boolean

  @ApiPropertyOptional({ example: true })
  push?: boolean
}

export class UpdateProfileDto implements UserApi.UpdateProfile.Request {
  @ApiPropertyOptional({ example: 'America/New_York' })
  timezone?: string

  @ApiPropertyOptional({ example: '+12025551234', nullable: true })
  phone?: string | null

  @ApiPropertyOptional({ type: NotificationPreferencesDto })
  notificationPreferences?: NotificationPreferencesDto
}
