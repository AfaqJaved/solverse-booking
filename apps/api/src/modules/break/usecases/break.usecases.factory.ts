import { Inject, Injectable } from '@nestjs/common'
import {
  ICreateBreakUsecase,
  IGetBreakUsecase,
  IGetBreaksByWorkingHoursUsecase,
  IUpdateBreakTimesUsecase,
  IDeleteBreakUsecase,
  CreateBreakUsecase,
  GetBreakUsecase,
  GetBreaksByWorkingHoursUsecase,
  UpdateBreakTimesUsecase,
  DeleteBreakUsecase,
} from '@solverse/domain'

@Injectable()
export class BreakUsecasesFactory {
  @Inject(ICreateBreakUsecase)
  public readonly createBreakUsecase!: CreateBreakUsecase

  @Inject(IGetBreakUsecase)
  public readonly getBreakUsecase!: GetBreakUsecase

  @Inject(IGetBreaksByWorkingHoursUsecase)
  public readonly getBreaksByWorkingHoursUsecase!: GetBreaksByWorkingHoursUsecase

  @Inject(IUpdateBreakTimesUsecase)
  public readonly updateBreakTimesUsecase!: UpdateBreakTimesUsecase

  @Inject(IDeleteBreakUsecase)
  public readonly deleteBreakUsecase!: DeleteBreakUsecase
}
