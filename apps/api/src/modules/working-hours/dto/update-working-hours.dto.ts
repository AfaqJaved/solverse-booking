import { ApiPropertyOptional } from '@nestjs/swagger'
import { WorkingHoursApi } from '@solverse/shared'

export class UpdateWorkingHoursDto implements WorkingHoursApi.Update.Request {
  @ApiPropertyOptional({ example: true })
  isOpen?: boolean

  @ApiPropertyOptional({
    example: '09:00',
    description:
      'Opening time in HH:MM format (24-hour). Required when isOpen is true or changing to true.',
  })
  openTime?: string | null

  @ApiPropertyOptional({
    example: '17:30',
    description:
      'Closing time in HH:MM format (24-hour). Required when isOpen is true or changing to true.',
  })
  closeTime?: string | null

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
  updatedBy!: string
}
