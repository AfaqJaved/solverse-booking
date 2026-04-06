import { Provider } from '@nestjs/common'
import {
  IRegisterBusinessUsecase,
  IGetBusinessUsecase,
  IGetBusinessesByOwnerUsecase,
  IActivateBusinessUsecase,
  IDeactivateBusinessUsecase,
  IReactivateBusinessUsecase,
  ISuspendBusinessUsecase,
  IUpdateBusinessProfileUsecase,
  IUpdateBusinessSlugUsecase,
  IChangePlanUsecase,
  IDeleteBusinessUsecase,
} from '@solverse/domain'
import { RegisterBusinessUsecaseImpl } from './register.business.usecase.impl'
import { GetBusinessUsecaseImpl } from './get.business.usecase.impl'
import { GetBusinessesByOwnerUsecaseImpl } from './get.businesses.by.owner.usecase.impl'
import { ActivateBusinessUsecaseImpl } from './activate.business.usecase.impl'
import { DeactivateBusinessUsecaseImpl } from './deactivate.business.usecase.impl'
import { ReactivateBusinessUsecaseImpl } from './reactivate.business.usecase.impl'
import { SuspendBusinessUsecaseImpl } from './suspend.business.usecase.impl'
import { UpdateBusinessProfileUsecaseImpl } from './update.profile.usecase.impl'
import { UpdateBusinessSlugUsecaseImpl } from './update.slug.usecase.impl'
import { ChangePlanUsecaseImpl } from './change.plan.usecase.impl'
import { DeleteBusinessUsecaseImpl } from './delete.business.usecase.impl'
export { BusinessUsecasesFactory } from './business.usecases.factory'

export const BUSINESS_USECASES: Provider[] = [
  { provide: IRegisterBusinessUsecase, useClass: RegisterBusinessUsecaseImpl },
  { provide: IGetBusinessUsecase, useClass: GetBusinessUsecaseImpl },
  { provide: IGetBusinessesByOwnerUsecase, useClass: GetBusinessesByOwnerUsecaseImpl },
  { provide: IActivateBusinessUsecase, useClass: ActivateBusinessUsecaseImpl },
  { provide: IDeactivateBusinessUsecase, useClass: DeactivateBusinessUsecaseImpl },
  { provide: IReactivateBusinessUsecase, useClass: ReactivateBusinessUsecaseImpl },
  { provide: ISuspendBusinessUsecase, useClass: SuspendBusinessUsecaseImpl },
  { provide: IUpdateBusinessProfileUsecase, useClass: UpdateBusinessProfileUsecaseImpl },
  { provide: IUpdateBusinessSlugUsecase, useClass: UpdateBusinessSlugUsecaseImpl },
  { provide: IChangePlanUsecase, useClass: ChangePlanUsecaseImpl },
  { provide: IDeleteBusinessUsecase, useClass: DeleteBusinessUsecaseImpl },
]
