import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { OnboardingApi } from '@solverse/shared'

export class OnboardingOwnerDto {
  @ApiProperty({ example: 'Jane' })
  firstName!: string

  @ApiProperty({ example: 'Doe' })
  lastName!: string

  @ApiProperty({ example: 'janedoe' })
  username!: string

  @ApiProperty({ example: 'jane@example.com' })
  email!: string

  @ApiPropertyOptional({ example: '+12025550100' })
  phone?: string

  @ApiProperty({ example: 'MySecurePassword1!' })
  password!: string

  @ApiProperty({ example: 'America/New_York' })
  timezone!: string
}

export class OnboardingBusinessDto {
  @ApiProperty({ example: 'Jane\'s Salon' })
  name!: string

  @ApiProperty({ example: 'janes-salon' })
  slug!: string

  @ApiPropertyOptional({ example: 'A premium hair salon' })
  description?: string | null

  @ApiProperty({ example: 'America/New_York' })
  timezone!: string

  @ApiPropertyOptional({ example: '+12025550101' })
  phone?: string

  @ApiProperty({ example: 'contact@janessalon.com' })
  email!: string

  @ApiProperty({ example: 'USD' })
  currency!: string
}

export class OnboardingDayScheduleDto
  implements OnboardingApi.Register.DaySchedule
{
  @ApiProperty({
    example: 'monday',
    enum: [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ],
  })
  day!:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday'

  @ApiProperty({ example: true })
  isOpen!: boolean

  @ApiPropertyOptional({ example: '09:00' })
  openTime?: string | null

  @ApiPropertyOptional({ example: '17:00' })
  closeTime?: string | null
}

export class OnboardingBreakInputDto implements OnboardingApi.Register.BreakInput {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id!: string

  @ApiProperty({ example: 'monday' })
  day!: OnboardingApi.Register.DaySchedule['day']

  @ApiProperty({ example: '12:00' })
  startTime!: string

  @ApiProperty({ example: '13:00' })
  endTime!: string

  @ApiProperty({ example: 'Lunch break' })
  label!: string
}

export class OnboardingTimeOffInputDto
  implements OnboardingApi.Register.TimeOffInput
{
  @ApiProperty({ example: 'Christmas' })
  label!: string

  @ApiProperty({ example: true })
  allDay!: boolean

  @ApiProperty({
    example: 'once',
    enum: ['once', 'daily', 'weekly', 'monthly', 'yearly'],
  })
  cadence!: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'

  @ApiProperty({ example: '2024-12-25' })
  startDate!: string

  @ApiProperty({ example: '2024-12-25' })
  endDate!: string

  @ApiPropertyOptional({ example: null })
  startTime?: string | null

  @ApiPropertyOptional({ example: null })
  endTime?: string | null
}

export class OnboardingServiceInputDto
  implements OnboardingApi.Register.ServiceInput
{
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id!: string

  @ApiProperty({ example: 'Haircut' })
  name!: string

  @ApiProperty({ example: 30 })
  duration!: number

  @ApiProperty({ example: 25 })
  price!: number

  @ApiPropertyOptional({ example: 'A classic cut and style' })
  description?: string | null
}

export class OnboardingDto implements OnboardingApi.Register.Request {
  @ApiProperty({ type: OnboardingOwnerDto })
  owner!: OnboardingOwnerDto

  @ApiProperty({ type: OnboardingBusinessDto })
  business!: OnboardingBusinessDto

  @ApiProperty({ type: [OnboardingDayScheduleDto] })
  workingHours!: OnboardingDayScheduleDto[]

  @ApiPropertyOptional({ type: [OnboardingBreakInputDto] })
  breaks?: OnboardingBreakInputDto[]

  @ApiPropertyOptional({ type: [OnboardingTimeOffInputDto] })
  timeOffs?: OnboardingTimeOffInputDto[]

  @ApiPropertyOptional({ type: [OnboardingServiceInputDto] })
  services?: OnboardingServiceInputDto[]
}
