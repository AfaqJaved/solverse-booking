import { ApiPropertyOptional } from '@nestjs/swagger'
import { ServiceApi } from '@solverse/shared'

export class UpdateServiceDto implements ServiceApi.Update.Request {
  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
  updatedBy!: string

  @ApiPropertyOptional({ example: 'Premium Haircut' })
  name?: string

  @ApiPropertyOptional({ example: 'Professional haircut with premium styling' })
  description?: string | null

  @ApiPropertyOptional({
    example: 45,
    description: 'Duration in minutes (5-480)',
  })
  duration?: number

  @ApiPropertyOptional({ example: 15, description: 'Buffer time in minutes' })
  bufferTime?: number

  @ApiPropertyOptional({
    example: 6000,
    description: 'Price in smallest currency unit',
  })
  price?: number

  @ApiPropertyOptional({ example: '#3366FF' })
  color?: string | null

  @ApiPropertyOptional({
    example: 3,
    description: 'Maximum concurrent bookings per slot',
  })
  maxBookingsPerSlot?: number
}
