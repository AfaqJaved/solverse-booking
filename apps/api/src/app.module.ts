import { Module } from '@nestjs/common'
import { UserModule } from './modules/user/user.module'
import { BusinessModule } from './modules/business/business.module'
import { CommonModule } from './modules/common/common.module'
import { SecurityModule } from './modules/security/security.module'
import { ServiceModule } from './modules/service/service.module'
import { BreakModule } from './modules/break/break.module'
import { WorkingHoursModule } from './modules/working-hours/working.hours.module'
import { TimeOffModule } from './modules/timeoff/timeoff.module'

@Module({
  imports: [
    CommonModule,
    SecurityModule,
    UserModule,
    BusinessModule,
    ServiceModule,
    BreakModule,
    WorkingHoursModule,
    TimeOffModule,
  ],
  controllers: [],
  providers: [],
})
export class SolverseApiModule {}
