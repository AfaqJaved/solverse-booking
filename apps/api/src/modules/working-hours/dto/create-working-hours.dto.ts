import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { WorkingHoursApi } from '@solverse/shared'

export class CreateWorkingHoursDto implements WorkingHoursApi.Create.Request {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  businessId!: string

  @ApiProperty({
    enum: [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ],
    example: 'monday',
  })
  dayOfWeek!:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday'

  @ApiProperty({ example: true })
  isOpen!: boolean

  @ApiPropertyOptional({
    example: '09:00',
    description:
      'Opening time in HH:MM format (24-hour). Required when isOpen is true.',
  })
  openTime?: string | null

  @ApiPropertyOptional({
    example: '17:30',
    description:
      'Closing time in HH:MM format (24-hour). Required when isOpen is true.',
  })
  closeTime?: string | null

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  createdBy!: string
}
