import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { UserApi } from '@solverse/shared'

export class NotificationPreferencesDto
  implements UserApi.UpdateProfile.NotificationPreferences
{
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  email?: boolean

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  sms?: boolean

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  push?: boolean
}

export class UpdateProfileDto implements UserApi.UpdateProfile.Request {
  @ApiPropertyOptional({ example: 'America/New_York' })
  @IsOptional()
  @IsString()
  timezone?: string

  @ApiPropertyOptional({ example: '+12025551234', nullable: true })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string | null

  @ApiPropertyOptional({ type: NotificationPreferencesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationPreferencesDto)
  notificationPreferences?: NotificationPreferencesDto
}
