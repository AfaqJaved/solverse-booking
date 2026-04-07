import { Module } from '@nestjs/common'
import { CommonModule } from '../common/common.module'
import { TIMEOFF_USECASES } from './usecases/entry'
import { TimeOffUsecaseFactory } from './usecases/timeoff.usecases.factory'
import { TimeOffController } from './timeoff.controller'
import { TimeOffMapper } from './mapper/timeoff.mapper'

@Module({
  imports: [CommonModule],
  controllers: [TimeOffController],
  providers: [...TIMEOFF_USECASES, TimeOffUsecaseFactory, TimeOffMapper],
  exports: [TimeOffUsecaseFactory],
})
export class TimeOffModule {}
