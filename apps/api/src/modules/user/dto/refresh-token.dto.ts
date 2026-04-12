import { UserApi } from '@solverse/shared'
import { ApiProperty } from '@nestjs/swagger'

export class RefreshTokenDto implements UserApi.RefreshToken.Request {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken!: string
}
