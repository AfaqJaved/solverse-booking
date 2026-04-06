import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BusinessApi } from '@solverse/shared'

export class RegisterBusinessDto implements BusinessApi.Register.Request {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', format: 'uuid' })
  ownerId!: string

  @ApiProperty({ example: 'Acme Salon & Spa' })
  name!: string

  @ApiProperty({ example: 'acme-salon' })
  slug!: string

  @ApiProperty({ example: 'contact@acmesalon.com' })
  email!: string

  @ApiProperty({ example: 'America/New_York' })
  timezone!: string

  @ApiProperty({ example: 'USD' })
  currency!: string

  @ApiPropertyOptional({ example: '+12025551234' })
  phone?: string

  @ApiPropertyOptional({ enum: ['free', 'starter', 'pro', 'enterprise'], example: 'free' })
  plan?: string
}
