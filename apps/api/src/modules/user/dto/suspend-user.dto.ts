import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { UserApi } from '@solverse/shared'

export class SuspendUserDto implements UserApi.SuspendUser.Request {
  @ApiProperty({ example: 'Violated terms of service' })
  @IsNotEmpty()
  @IsString()
  reason!: string
}
