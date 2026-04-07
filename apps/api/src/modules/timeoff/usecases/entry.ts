import { Provider } from '@nestjs/common'
import {
  ICreateTimeOffUsecase,
  IGetTimeOffUsecase,
  IGetTimeOffsByBusinessUsecase,
  IUpdateTimeOffUsecase,
  ICancelTimeOffUsecase,
  IDeleteTimeOffUsecase,
} from '@solverse/domain'
import { CreateTimeOffUsecaseImpl } from './create.timeoff.usecase.impl'
import { GetTimeOffUsecaseImpl } from './get.timeoff.usecase.impl'
import { GetTimeOffsByBusinessUsecaseImpl } from './get.timeoffs.by.business.usecase.impl'
import { UpdateTimeOffUsecaseImpl } from './update.timeoff.usecase.impl'
import { CancelTimeOffUsecaseImpl } from './cancel.timeoff.usecase.impl'
import { DeleteTimeOffUsecaseImpl } from './delete.timeoff.usecase.impl'

export const TIMEOFF_USECASES: Provider[] = [
  { provide: ICreateTimeOffUsecase, useClass: CreateTimeOffUsecaseImpl },
  { provide: IGetTimeOffUsecase, useClass: GetTimeOffUsecaseImpl },
  {
    provide: IGetTimeOffsByBusinessUsecase,
    useClass: GetTimeOffsByBusinessUsecaseImpl,
  },
  { provide: IUpdateTimeOffUsecase, useClass: UpdateTimeOffUsecaseImpl },
  { provide: ICancelTimeOffUsecase, useClass: CancelTimeOffUsecaseImpl },
  { provide: IDeleteTimeOffUsecase, useClass: DeleteTimeOffUsecaseImpl },
]
