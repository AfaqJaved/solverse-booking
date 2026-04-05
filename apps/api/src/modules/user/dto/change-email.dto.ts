import { ApiProperty } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'
import { UserApi } from '@solverse/shared'

export class ChangeEmailDto implements UserApi.ChangeEmail.Request {
  @ApiProperty({ example: 'newemail@example.com' })
  @IsEmail()
  newEmail!: string
}
