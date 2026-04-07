import { Injectable, Inject } from '@nestjs/common'
import {
  ICreateWorkingHoursUsecase,
  CreateWorkingHoursUsecase,
  IGetWorkingHoursUsecase,
  GetWorkingHoursUsecase,
  IUpdateWorkingHoursUsecase,
  UpdateWorkingHoursUsecase,
  IDeleteWorkingHoursUsecase,
  DeleteWorkingHoursUsecase,
  IListWorkingHoursByBusinessUsecase,
  ListWorkingHoursByBusinessUsecase,
} from '@solverse/domain'

@Injectable()
export class WorkingHoursUsecasesFactory {
  @Inject(ICreateWorkingHoursUsecase)
  public readonly createWorkingHoursUsecase!: CreateWorkingHoursUsecase

  @Inject(IGetWorkingHoursUsecase)
  public readonly getWorkingHoursUsecase!: GetWorkingHoursUsecase

  @Inject(IUpdateWorkingHoursUsecase)
  public readonly updateWorkingHoursUsecase!: UpdateWorkingHoursUsecase

  @Inject(IDeleteWorkingHoursUsecase)
  public readonly deleteWorkingHoursUsecase!: DeleteWorkingHoursUsecase

  @Inject(IListWorkingHoursByBusinessUsecase)
  public readonly listWorkingHoursByBusinessUsecase!: ListWorkingHoursByBusinessUsecase
}
