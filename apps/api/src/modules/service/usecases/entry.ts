import { Provider } from '@nestjs/common'
import {
  ICreateServiceUsecase,
  IGetServiceUsecase,
  IGetServicesByBusinessUsecase,
  IUpdateServiceUsecase,
  IActivateServiceUsecase,
  IDeactivateServiceUsecase,
  IDeleteServiceUsecase,
} from '@solverse/domain'
import { CreateServiceUsecaseImpl } from './create.service.usecase.impl'
import { GetServiceUsecaseImpl } from './get.service.usecase.impl'
import { GetServicesByBusinessUsecaseImpl } from './get.services.by.business.usecase.impl'
import { UpdateServiceUsecaseImpl } from './update.service.usecase.impl'
import { ActivateServiceUsecaseImpl } from './activate.service.usecase.impl'
import { DeactivateServiceUsecaseImpl } from './deactivate.service.usecase.impl'
import { DeleteServiceUsecaseImpl } from './delete.service.usecase.impl'
export { ServiceUsecasesFactory } from './service.usecases.factory'

export const SERVICE_USECASES: Provider[] = [
  { provide: ICreateServiceUsecase, useClass: CreateServiceUsecaseImpl },
  { provide: IGetServiceUsecase, useClass: GetServiceUsecaseImpl },
  {
    provide: IGetServicesByBusinessUsecase,
    useClass: GetServicesByBusinessUsecaseImpl,
  },
  { provide: IUpdateServiceUsecase, useClass: UpdateServiceUsecaseImpl },
  { provide: IActivateServiceUsecase, useClass: ActivateServiceUsecaseImpl },
  {
    provide: IDeactivateServiceUsecase,
    useClass: DeactivateServiceUsecaseImpl,
  },
  { provide: IDeleteServiceUsecase, useClass: DeleteServiceUsecaseImpl },
]
