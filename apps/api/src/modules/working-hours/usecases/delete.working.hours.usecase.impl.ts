import { Injectable } from '@nestjs/common'
import {
  WorkingHoursId,
  DatabaseFailure,
  InvalidInputError,
  DeleteWorkingHoursUsecase,
  WorkingHoursNotFoundError,
  WorkingHoursDeletedError,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class DeleteWorkingHoursUsecaseImpl implements DeleteWorkingHoursUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    id,
    deletedBy,
  }: {
    id: string
    deletedBy: string
  }): Effect.Effect<
    void,
    | InvalidInputError
    | DatabaseFailure
    | WorkingHoursNotFoundError
    | WorkingHoursDeletedError
  > {
    return Effect.gen(this, function* () {
      const decodedId = yield* decodeOrFail(WorkingHoursId)(id)
      const deletedByUserId = yield* decodeOrFail(UserId)(deletedBy)

      const workingHoursOption =
        yield* this.repositoryFactory.workingHoursRepository.findById(decodedId)

      if (Option.isNone(workingHoursOption)) {
        return yield* Effect.fail(
          new WorkingHoursNotFoundError({
            message: `Working hours with ID ${id} not found`,
            cause: `Working hours with ID ${id} not found`,
          }),
        )
      }

      const workingHours = workingHoursOption.value

      const result = workingHours.softDelete(deletedByUserId)
      if (Effect.isFailure(result)) {
        return yield* result
      }

      const deletedWorkingHours = yield* result

      yield* this.repositoryFactory.workingHoursRepository.save(
        deletedWorkingHours,
      )
    })
  }
}
