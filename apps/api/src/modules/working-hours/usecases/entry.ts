import { Provider } from '@nestjs/common'
import {
  ICreateWorkingHoursUsecase,
  IGetWorkingHoursUsecase,
  IUpdateWorkingHoursUsecase,
  IDeleteWorkingHoursUsecase,
  IListWorkingHoursByBusinessUsecase,
} from '@solverse/domain'
import { CreateWorkingHoursUsecaseImpl } from './create.working.hours.usecase.impl'
import { GetWorkingHoursUsecaseImpl } from './get.working.hours.usecase.impl'
import { UpdateWorkingHoursUsecaseImpl } from './update.working.hours.usecase.impl'
import { DeleteWorkingHoursUsecaseImpl } from './delete.working.hours.usecase.impl'
import { ListWorkingHoursByBusinessUsecaseImpl } from './list.working.hours.by.business.usecase.impl'
export { WorkingHoursUsecasesFactory } from './working.hours.usecases.factory'

export const WORKING_HOURS_USECASES: Provider[] = [
  {
    provide: ICreateWorkingHoursUsecase,
    useClass: CreateWorkingHoursUsecaseImpl,
  },
  { provide: IGetWorkingHoursUsecase, useClass: GetWorkingHoursUsecaseImpl },
  {
    provide: IUpdateWorkingHoursUsecase,
    useClass: UpdateWorkingHoursUsecaseImpl,
  },
  {
    provide: IDeleteWorkingHoursUsecase,
    useClass: DeleteWorkingHoursUsecaseImpl,
  },
  {
    provide: IListWorkingHoursByBusinessUsecase,
    useClass: ListWorkingHoursByBusinessUsecaseImpl,
  },
]
