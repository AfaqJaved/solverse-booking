import { Inject, Injectable } from '@nestjs/common'
import {
  ICreateServiceUsecase,
  IGetServiceUsecase,
  IGetServicesByBusinessUsecase,
  IUpdateServiceUsecase,
  IActivateServiceUsecase,
  IDeactivateServiceUsecase,
  IDeleteServiceUsecase,
  CreateServiceUsecase,
  GetServiceUsecase,
  GetServicesByBusinessUsecase,
  UpdateServiceUsecase,
  ActivateServiceUsecase,
  DeactivateServiceUsecase,
  DeleteServiceUsecase,
} from '@solverse/domain'

@Injectable()
export class ServiceUsecasesFactory {
  @Inject(ICreateServiceUsecase)
  public readonly createServiceUsecase!: CreateServiceUsecase

  @Inject(IGetServiceUsecase)
  public readonly getServiceUsecase!: GetServiceUsecase

  @Inject(IGetServicesByBusinessUsecase)
  public readonly getServicesByBusinessUsecase!: GetServicesByBusinessUsecase

  @Inject(IUpdateServiceUsecase)
  public readonly updateServiceUsecase!: UpdateServiceUsecase

  @Inject(IActivateServiceUsecase)
  public readonly activateServiceUsecase!: ActivateServiceUsecase

  @Inject(IDeactivateServiceUsecase)
  public readonly deactivateServiceUsecase!: DeactivateServiceUsecase

  @Inject(IDeleteServiceUsecase)
  public readonly deleteServiceUsecase!: DeleteServiceUsecase
}
