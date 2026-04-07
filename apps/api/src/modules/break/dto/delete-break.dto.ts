import { ApiProperty } from '@nestjs/swagger'
import { BreakApi } from '@solverse/shared'

export class DeleteBreakDto implements BreakApi.Delete.Request {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  deletedBy!: string
}
