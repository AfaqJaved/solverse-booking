import { Injectable } from '@nestjs/common'
import {
  WorkingHours,
  WorkingHoursId,
  DayOfWeek,
  BusinessId,
  DatabaseFailure,
  InvalidInputError,
  CreateWorkingHoursUsecase,
  UserId,
  WorkingHoursTimeOfDay,
} from '@solverse/domain'
import { WorkingHoursDayTakenError } from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class CreateWorkingHoursUsecaseImpl implements CreateWorkingHoursUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    id,
    businessId,
    dayOfWeek,
    isOpen,
    openTime,
    closeTime,
    createdBy,
  }: {
    id: string
    businessId: string
    dayOfWeek: string
    isOpen: boolean
    openTime?: string | null
    closeTime?: string | null
    createdBy: string
  }): Effect.Effect<
    WorkingHours,
    InvalidInputError | DatabaseFailure | WorkingHoursDayTakenError
  > {
    return Effect.gen(this, function* () {
      const decodedId = yield* decodeOrFail(WorkingHoursId)(id)
      const decodedBusinessId = yield* decodeOrFail(BusinessId)(businessId)
      const decodedDayOfWeek = yield* decodeOrFail(DayOfWeek)(dayOfWeek)
      const createdByUserId = yield* decodeOrFail(UserId)(createdBy)

      let decodedOpenTime: WorkingHoursTimeOfDay | null = null
      let decodedCloseTime: WorkingHoursTimeOfDay | null = null

      if (isOpen) {
        if (openTime) {
          decodedOpenTime = yield* decodeOrFail(WorkingHoursTimeOfDay)(openTime)
        }
        if (closeTime) {
          decodedCloseTime = yield* decodeOrFail(WorkingHoursTimeOfDay)(
            closeTime,
          )
        }
      }

      const dayTaken =
        yield* this.repositoryFactory.workingHoursRepository.dayExistsForBusiness(
          decodedBusinessId,
          decodedDayOfWeek,
        )

      if (dayTaken) {
        return yield* Effect.fail(
          new WorkingHoursDayTakenError({
            message: `Working hours for ${decodedDayOfWeek} already exist for this business`,
            cause: `Working hours for ${decodedDayOfWeek} already exist for this business`,
          }),
        )
      }

      const workingHours = WorkingHours.create({
        id: decodedId,
        businessId: decodedBusinessId,
        dayOfWeek: decodedDayOfWeek,
        isOpen,
        openTime: decodedOpenTime,
        closeTime: decodedCloseTime,
        createdBy: createdByUserId,
      })

      yield* this.repositoryFactory.workingHoursRepository.save(workingHours)

      return workingHours
    })
  }
}
