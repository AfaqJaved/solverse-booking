import { ApiProperty } from '@nestjs/swagger'
import { BusinessApi } from '@solverse/shared'

export class ChangePlanDto implements BusinessApi.ChangePlan.Request {
  @ApiProperty({
    enum: ['free', 'starter', 'pro', 'enterprise'],
    example: 'pro',
  })
  plan!: BusinessApi.PlanType

  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    format: 'uuid',
  })
  actorId!: string
}
