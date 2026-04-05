import { UserApi } from '@solverse/shared'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto implements UserApi.Login.Request {
  @ApiProperty({ example: 'john_doe or john@example.com' })
  userNameOrEmail!: string

  @ApiProperty({ example: 'password123' })
  password!: string
}
