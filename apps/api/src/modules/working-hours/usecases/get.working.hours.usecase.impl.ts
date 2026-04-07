import { Injectable } from '@nestjs/common'
import {
  WorkingHours,
  WorkingHoursId,
  DatabaseFailure,
  InvalidInputError,
  GetWorkingHoursUsecase,
  WorkingHoursNotFoundError,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class GetWorkingHoursUsecaseImpl implements GetWorkingHoursUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    id,
  }: {
    id: string
  }): Effect.Effect<
    WorkingHours,
    InvalidInputError | DatabaseFailure | WorkingHoursNotFoundError
  > {
    return Effect.gen(this, function* () {
      const decodedId = yield* decodeOrFail(WorkingHoursId)(id)

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

      return workingHoursOption.value
    })
  }
}
