import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { BusinessApi } from '@solverse/shared'

export class UpdateBusinessProfileDto implements BusinessApi.UpdateProfile.Request {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', format: 'uuid' })
  actorId!: string

  @ApiPropertyOptional({ example: 'Acme Salon & Spa' })
  name?: string

  @ApiPropertyOptional({ example: 'Full-service salon and day spa.', nullable: true })
  description?: string | null

  @ApiPropertyOptional({ example: 'https://acmesalon.com', nullable: true })
  website?: string | null

  @ApiPropertyOptional({ example: 'https://cdn.example.com/logo.png', nullable: true })
  logoUrl?: string | null

  @ApiPropertyOptional({ example: '+12025551234', nullable: true })
  phone?: string | null

  @ApiPropertyOptional({ example: 'America/New_York' })
  timezone?: string

  @ApiPropertyOptional({ example: 'contact@acmesalon.com' })
  email?: string

  @ApiPropertyOptional({ example: 'USD' })
  currency?: string
}
