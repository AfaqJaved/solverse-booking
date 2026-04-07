import { Injectable } from '@nestjs/common'
import {
  BreakId,
  BreakTimeOfDay,
  DatabaseFailure,
  InvalidInputError,
  UpdateBreakTimesUsecase,
  BreakNotFoundError,
  BreakDeletedError,
  BreakTimeConflictError,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class UpdateBreakTimesUsecaseImpl implements UpdateBreakTimesUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute(params: {
    breakId: string
    startTime: string
    endTime: string
    updatedBy: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | BreakNotFoundError
    | BreakDeletedError
    | BreakTimeConflictError
    | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const decodedId = yield* decodeOrFail(BreakId)(params.breakId)
      const decodedStartTime = yield* decodeOrFail(BreakTimeOfDay)(
        params.startTime,
      )
      const decodedEndTime = yield* decodeOrFail(BreakTimeOfDay)(params.endTime)
      const updatedByUserId = yield* decodeOrFail(UserId)(params.updatedBy)

      const breakEntity =
        yield* this.repositoryFactory.breakRepository.findById(decodedId)

      if (Option.isNone(breakEntity)) {
        return yield* Effect.fail(
          new BreakNotFoundError({
            message: `Break with ID ${params.breakId} not found`,
            cause: `Break with ID ${params.breakId} not found`,
          }),
        )
      }

      const breakData = breakEntity.value

      if (breakData.isDeleted) {
        return yield* Effect.fail(
          new BreakDeletedError({
            message: `Break with ID ${params.breakId} has been deleted`,
            cause: `Break with ID ${params.breakId} has been deleted`,
          }),
        )
      }

      const hasConflict =
        yield* this.repositoryFactory.breakRepository.hasTimeConflict(
          breakData.workingHoursId,
          decodedStartTime,
          decodedEndTime,
          decodedId,
        )

      if (hasConflict) {
        return yield* Effect.fail(
          new BreakTimeConflictError({
            message: `Break time conflicts with existing break for working hours`,
            cause: `Break time ${decodedStartTime}-${decodedEndTime} conflicts with existing break`,
          }),
        )
      }

      const updatedBreak = breakData.updateTimes(
        decodedStartTime,
        decodedEndTime,
        updatedByUserId,
      )

      yield* this.repositoryFactory.breakRepository.save(updatedBreak)
    })
  }
}
