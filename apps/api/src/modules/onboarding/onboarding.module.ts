import { Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { BusinessModule } from '../business/business.module'
import { WorkingHoursModule } from '../working-hours/working.hours.module'
import { BreakModule } from '../break/break.module'
import { TimeOffModule } from '../timeoff/timeoff.module'
import { ServiceModule } from '../service/service.module'
import { OnboardingController } from './onboarding.controller'
import { OnboardUsecaseImpl } from './usecases/onboard.usecase.impl'

@Module({
  imports: [
    UserModule,
    BusinessModule,
    WorkingHoursModule,
    BreakModule,
    TimeOffModule,
    ServiceModule,
  ],
  controllers: [OnboardingController],
  providers: [OnboardUsecaseImpl],
})
export class OnboardingModule {}
