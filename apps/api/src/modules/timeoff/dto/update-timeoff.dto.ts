import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDate, IsOptional, IsString } from 'class-validator'

export class UpdateTimeOffDto {
  @ApiPropertyOptional({ example: 'Christmas Holiday' })
  @IsOptional()
  @IsString()
  label?: string

  @ApiPropertyOptional({ example: '2024-12-24' })
  @IsOptional()
  @IsDate()
  startDate?: Date

  @ApiPropertyOptional({ example: '2024-12-26' })
  @IsOptional()
  @IsDate()
  endDate?: Date

  @ApiPropertyOptional({ example: '09:00' })
  @IsOptional()
  @IsString()
  startTime?: string | null

  @ApiPropertyOptional({ example: '17:00' })
  @IsOptional()
  @IsString()
  endTime?: string | null
}
