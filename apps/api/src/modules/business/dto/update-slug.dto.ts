import { ApiProperty } from '@nestjs/swagger'
import { BusinessApi } from '@solverse/shared'

export class UpdateBusinessSlugDto implements BusinessApi.UpdateSlug.Request {
  @ApiProperty({ example: 'new-slug' })
  slug!: string

  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    format: 'uuid',
  })
  actorId!: string
}
