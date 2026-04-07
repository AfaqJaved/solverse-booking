import { ApiProperty } from '@nestjs/swagger'
import { BreakApi } from '@solverse/shared'

export class CreateBreakDto implements BreakApi.Create.Request {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  workingHoursId!: string

  @ApiProperty({ example: 'Lunch Break' })
  label!: string

  @ApiProperty({
    example: '12:00',
    description: 'Start time in HH:MM 24-hour format',
  })
  startTime!: string

  @ApiProperty({
    example: '13:00',
    description: 'End time in HH:MM 24-hour format',
  })
  endTime!: string

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  createdBy!: string
}
