import { Inject, Injectable } from '@nestjs/common'
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
  RegisterBusinessUsecase,
  GetBusinessUsecase,
  GetBusinessesByOwnerUsecase,
  ActivateBusinessUsecase,
  DeactivateBusinessUsecase,
  ReactivateBusinessUsecase,
  SuspendBusinessUsecase,
  UpdateBusinessProfileUsecase,
  UpdateBusinessSlugUsecase,
  ChangePlanUsecase,
  DeleteBusinessUsecase,
} from '@solverse/domain'

@Injectable()
export class BusinessUsecasesFactory {
  @Inject(IRegisterBusinessUsecase)
  public readonly registerBusinessUsecase!: RegisterBusinessUsecase

  @Inject(IGetBusinessUsecase)
  public readonly getBusinessUsecase!: GetBusinessUsecase

  @Inject(IGetBusinessesByOwnerUsecase)
  public readonly getBusinessesByOwnerUsecase!: GetBusinessesByOwnerUsecase

  @Inject(IActivateBusinessUsecase)
  public readonly activateBusinessUsecase!: ActivateBusinessUsecase

  @Inject(IDeactivateBusinessUsecase)
  public readonly deactivateBusinessUsecase!: DeactivateBusinessUsecase

  @Inject(IReactivateBusinessUsecase)
  public readonly reactivateBusinessUsecase!: ReactivateBusinessUsecase

  @Inject(ISuspendBusinessUsecase)
  public readonly suspendBusinessUsecase!: SuspendBusinessUsecase

  @Inject(IUpdateBusinessProfileUsecase)
  public readonly updateBusinessProfileUsecase!: UpdateBusinessProfileUsecase

  @Inject(IUpdateBusinessSlugUsecase)
  public readonly updateBusinessSlugUsecase!: UpdateBusinessSlugUsecase

  @Inject(IChangePlanUsecase)
  public readonly changePlanUsecase!: ChangePlanUsecase

  @Inject(IDeleteBusinessUsecase)
  public readonly deleteBusinessUsecase!: DeleteBusinessUsecase
}
