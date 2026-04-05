import { ApiProperty } from '@nestjs/swagger'
import { UserApi } from '@solverse/shared'

export class ChangeEmailDto implements UserApi.ChangeEmail.Request {
  @ApiProperty({ example: 'newemail@example.com' })
  newEmail!: string
}
