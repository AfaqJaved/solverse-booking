import { Provider } from '@nestjs/common'
import {
  ICreateBreakUsecase,
  IGetBreakUsecase,
  IGetBreaksByWorkingHoursUsecase,
  IUpdateBreakTimesUsecase,
  IDeleteBreakUsecase,
} from '@solverse/domain'
import { CreateBreakUsecaseImpl } from './create.break.usecase.impl'
import { GetBreakUsecaseImpl } from './get.break.usecase.impl'
import { GetBreaksByWorkingHoursUsecaseImpl } from './get.breaks.by.working.hours.usecase.impl'
import { UpdateBreakTimesUsecaseImpl } from './update.break.times.usecase.impl'
import { DeleteBreakUsecaseImpl } from './delete.break.usecase.impl'
export { BreakUsecasesFactory } from './break.usecases.factory'

export const BREAK_USECASES: Provider[] = [
  { provide: ICreateBreakUsecase, useClass: CreateBreakUsecaseImpl },
  { provide: IGetBreakUsecase, useClass: GetBreakUsecaseImpl },
  { provide: IGetBreaksByWorkingHoursUsecase, useClass: GetBreaksByWorkingHoursUsecaseImpl },
  { provide: IUpdateBreakTimesUsecase, useClass: UpdateBreakTimesUsecaseImpl },
  { provide: IDeleteBreakUsecase, useClass: DeleteBreakUsecaseImpl },
]