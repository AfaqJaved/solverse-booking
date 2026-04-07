import { ApiProperty } from '@nestjs/swagger'
import { ServiceApi } from '@solverse/shared'

export class DeleteServiceDto implements ServiceApi.Delete.Request {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  deletedBy!: string
}
