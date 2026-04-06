import { Injectable } from '@nestjs/common'
import {
  BreakId,
  DatabaseFailure,
  InvalidInputError,
  DeleteBreakUsecase,
  BreakNotFoundError,
  BreakDeletedError,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class DeleteBreakUsecaseImpl implements DeleteBreakUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute(params: {
    breakId: string
    deletedBy: string
  }): Effect.Effect<
    void,
    InvalidInputError | BreakNotFoundError | BreakDeletedError | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const decodedId = yield* decodeOrFail(BreakId)(params.breakId)
      const deletedByUserId = yield* decodeOrFail(UserId)(params.deletedBy)

      const breakEntity = yield* this.repositoryFactory.breakRepository.findById(decodedId)

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
            message: `Break with ID ${params.breakId} has already been deleted`,
            cause: `Break with ID ${params.breakId} has already been deleted`,
          }),
        )
      }

      const deletedBreak = breakData.softDelete(deletedByUserId)

      yield* this.repositoryFactory.breakRepository.save(deletedBreak)
    })
  }
}