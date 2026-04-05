import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { UserApi } from '@solverse/shared'

export class FullNameDto implements UserApi.Register.FullName {
  @ApiProperty({ example: 'John' })
  firstName!: string

  @ApiProperty({ example: 'Doe' })
  lastName!: string
}

export class RegisterDto implements UserApi.Register.Request {
  @ApiProperty({ example: 'john_doe' })
  username!: string

  @ApiProperty({ example: 'password123' })
  password!: string

  @ApiProperty({ type: FullNameDto })
  name!: FullNameDto

  @ApiProperty({ example: 'john@example.com' })
  email!: string

  @ApiProperty({ enum: ['superAdmin', 'businessOwner', 'locationOwner'] })
  role!: 'superAdmin' | 'businessOwner' | 'locationOwner'

  @ApiProperty({ example: 'America/New_York' })
  timezone!: string

  @ApiPropertyOptional({ example: '+12025551234' })
  phone?: string
}
