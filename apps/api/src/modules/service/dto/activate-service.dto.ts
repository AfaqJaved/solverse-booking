import { ApiProperty } from '@nestjs/swagger'
import { ServiceApi } from '@solverse/shared'

export class ActivateServiceDto implements ServiceApi.Activate.Request {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  updatedBy!: string
}
