import { Inject, Injectable } from '@nestjs/common'
import {
  ICreateTimeOffUsecase,
  IGetTimeOffUsecase,
  IGetTimeOffsByBusinessUsecase,
  IUpdateTimeOffUsecase,
  ICancelTimeOffUsecase,
  IDeleteTimeOffUsecase,
  CreateTimeOffUsecase,
  GetTimeOffUsecase,
  GetTimeOffsByBusinessUsecase,
  UpdateTimeOffUsecase,
  CancelTimeOffUsecase,
  DeleteTimeOffUsecase,
} from '@solverse/domain'

@Injectable()
export class TimeOffUsecaseFactory {
  @Inject(ICreateTimeOffUsecase)
  public readonly createTimeOffUsecase!: CreateTimeOffUsecase

  @Inject(IGetTimeOffUsecase)
  public readonly getTimeOffUsecase!: GetTimeOffUsecase

  @Inject(IGetTimeOffsByBusinessUsecase)
  public readonly getTimeOffsByBusinessUsecase!: GetTimeOffsByBusinessUsecase

  @Inject(IUpdateTimeOffUsecase)
  public readonly updateTimeOffUsecase!: UpdateTimeOffUsecase

  @Inject(ICancelTimeOffUsecase)
  public readonly cancelTimeOffUsecase!: CancelTimeOffUsecase

  @Inject(IDeleteTimeOffUsecase)
  public readonly deleteTimeOffUsecase!: DeleteTimeOffUsecase
}
