import { UserApi } from '@solverse/shared'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class LoginDto implements UserApi.Login.Request {
  @ApiProperty({ example: 'john_doe or john@example.com' })
  @IsNotEmpty()
  @IsString()
  userNameOrEmail!: string

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  password!: string
}
