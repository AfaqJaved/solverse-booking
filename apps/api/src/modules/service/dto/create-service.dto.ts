import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ServiceApi } from '@solverse/shared'

export class CreateServiceDto implements ServiceApi.Create.Request {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  businessId!: string

  @ApiProperty({ example: 'Haircut' })
  name!: string

  @ApiProperty({ example: 30, description: 'Duration in minutes (5-480)' })
  duration!: number

  @ApiProperty({ example: 5000, description: 'Price in smallest currency unit (e.g. cents)' })
  price!: number

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  createdBy!: string

  @ApiPropertyOptional({ example: 'Professional haircut with styling' })
  description?: string | null

  @ApiPropertyOptional({ example: 10, description: 'Buffer time in minutes' })
  bufferTime?: number

  @ApiPropertyOptional({ example: '#FF5733' })
  color?: string | null

  @ApiPropertyOptional({ example: 2, description: 'Maximum concurrent bookings per slot' })
  maxBookingsPerSlot?: number

  @ApiPropertyOptional({ enum: ['active', 'inactive'], example: 'active' })
  status?: 'active' | 'inactive'
}