import { ApiProperty } from '@nestjs/swagger'
import { UserApi } from '@solverse/shared'

export class SuspendUserDto implements UserApi.SuspendUser.Request {
  @ApiProperty({ example: 'Violated terms of service' })
  reason!: string
}
