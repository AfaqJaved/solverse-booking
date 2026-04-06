import { Module } from '@nestjs/common'
import { CommonModule } from '../common/common.module'
import { BREAK_USECASES, BreakUsecasesFactory } from './usecases/entry'
import { BreakController } from './break.controller'

@Module({
  imports: [CommonModule],
  controllers: [BreakController],
  providers: [...BREAK_USECASES, BreakUsecasesFactory],
  exports: [BreakUsecasesFactory],
})
export class BreakModule {}