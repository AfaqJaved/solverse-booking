import { ApiProperty } from '@nestjs/swagger'
import { BusinessApi } from '@solverse/shared'

export class SuspendBusinessDto implements BusinessApi.Suspend.Request {
  @ApiProperty({ example: 'Violated terms of service' })
  reason!: string

  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    format: 'uuid',
  })
  actorId!: string
}
