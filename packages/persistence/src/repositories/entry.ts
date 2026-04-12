import { Provider } from '@nestjs/common'
import {
  IBreakRepository,
  IBusinessRepository,
  IOnboardingRepository,
  IServiceRepository,
  IUserRepository,
  IWorkingHoursRepository,
  ITimeOffRepository,
} from '@solverse/domain'
import { UserRepositoryImpl } from './user.repository.impl'
import { BusinessRepositoryImpl } from './business.repository.impl'
import { ServiceRepositoryImpl } from './service.repository.impl'
import { BreakRepositoryImpl } from './break.repository.impl'
import { WorkingHoursRepositoryImpl } from './working.hours.repository.impl'
import { TimeOffRepositoryImpl } from './timeoff.repository.impl'
import { OnboardingRepositoryImpl } from './onboarding.repository.impl'

export const REPOSITORIES: Provider[] = [
  { provide: IUserRepository, useClass: UserRepositoryImpl },
  { provide: IBusinessRepository, useClass: BusinessRepositoryImpl },
  { provide: IServiceRepository, useClass: ServiceRepositoryImpl },
  { provide: IBreakRepository, useClass: BreakRepositoryImpl },
  { provide: IWorkingHoursRepository, useClass: WorkingHoursRepositoryImpl },
  { provide: ITimeOffRepository, useClass: TimeOffRepositoryImpl },
  { provide: IOnboardingRepository, useClass: OnboardingRepositoryImpl },
]
