import { ApiProperty } from '@nestjs/swagger'
import { BreakApi } from '@solverse/shared'

export class UpdateBreakTimesDto implements BreakApi.UpdateTimes.Request {
  @ApiProperty({
    example: '12:30',
    description: 'Start time in HH:MM 24-hour format',
  })
  startTime!: string

  @ApiProperty({
    example: '13:30',
    description: 'End time in HH:MM 24-hour format',
  })
  endTime!: string

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  updatedBy!: string
}
