import { Module } from '@nestjs/common'
import { CommonModule } from '../common/common.module'
import {
  WORKING_HOURS_USECASES,
  WorkingHoursUsecasesFactory,
} from './usecases/entry'
import { WorkingHoursController } from './working.hours.controller'

@Module({
  imports: [CommonModule],
  controllers: [WorkingHoursController],
  providers: [...WORKING_HOURS_USECASES, WorkingHoursUsecasesFactory],
  exports: [WorkingHoursUsecasesFactory],
})
export class WorkingHoursModule {}
