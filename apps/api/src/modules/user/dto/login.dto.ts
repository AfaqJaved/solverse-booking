import { UserApi } from '@solverse/shared'
import { IsNotEmpty, IsString } from 'class-validator'

export class LoginDto implements UserApi.Login.Request {
  @IsNotEmpty()
  @IsString()
  userNameOrEmail!: string

  @IsNotEmpty()
  @IsString()
  password!: string
}
