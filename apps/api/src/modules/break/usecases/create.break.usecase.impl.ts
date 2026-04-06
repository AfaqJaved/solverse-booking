import { Injectable } from '@nestjs/common'
import {
  Break,
  BreakId,
  BreakTimeOfDay,
  WorkingHoursId,
  DatabaseFailure,
  InvalidInputError,
  CreateBreakUsecase,
  UserId,
  BreakTimeConflictError,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class CreateBreakUsecaseImpl implements CreateBreakUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute(params: {
    id: string
    workingHoursId: string
    label: string
    startTime: string
    endTime: string
    createdBy: string
  }): Effect.Effect<
    Break,
    InvalidInputError | BreakTimeConflictError | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const decodedId = yield* decodeOrFail(BreakId)(params.id)
      const decodedWorkingHoursId = yield* decodeOrFail(WorkingHoursId)(params.workingHoursId)
      const decodedStartTime = yield* decodeOrFail(BreakTimeOfDay)(params.startTime)
      const decodedEndTime = yield* decodeOrFail(BreakTimeOfDay)(params.endTime)
      const createdByUserId = yield* decodeOrFail(UserId)(params.createdBy)

      const hasConflict = yield* this.repositoryFactory.breakRepository.hasTimeConflict(
        decodedWorkingHoursId,
        decodedStartTime,
        decodedEndTime,
        decodedId
      )

      if (hasConflict) {
        return yield* Effect.fail(
          new BreakTimeConflictError({
            message: `Break time conflicts with existing break for working hours`,
            cause: `Break time ${decodedStartTime}-${decodedEndTime} conflicts with existing break`,
          }),
        )
      }

      const breakEntity = Break.create({
        id: decodedId,
        workingHoursId: decodedWorkingHoursId,
        label: params.label,
        startTime: decodedStartTime,
        endTime: decodedEndTime,
        createdBy: createdByUserId,
      })

      yield* this.repositoryFactory.breakRepository.save(breakEntity)

      return breakEntity
    })
  }
}