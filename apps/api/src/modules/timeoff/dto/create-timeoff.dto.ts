import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateTimeOffDto {
  @ApiProperty({ example: 'Christmas Holiday' })
  @IsString()
  label!: string

  @ApiProperty({ example: true })
  @IsBoolean()
  allDay!: boolean

  @ApiProperty({ enum: ['once', 'daily', 'weekly', 'monthly', 'yearly'] })
  @IsEnum(['once', 'daily', 'weekly', 'monthly', 'yearly'])
  cadence!: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'

  @ApiProperty({ example: '2024-12-24' })
  @IsDate()
  startDate!: Date

  @ApiProperty({ example: '2024-12-26' })
  @IsDate()
  endDate!: Date

  @ApiPropertyOptional({ example: '09:00' })
  @IsOptional()
  @IsString()
  startTime?: string | null

  @ApiPropertyOptional({ example: '17:00' })
  @IsOptional()
  @IsString()
  endTime?: string | null
}
