import { Injectable } from '@nestjs/common'
import {
  Break,
  BreakId,
  DatabaseFailure,
  InvalidInputError,
  GetBreakUsecase,
  BreakNotFoundError,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class GetBreakUsecaseImpl implements GetBreakUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute(params: {
    breakId: string
  }): Effect.Effect<
    Break,
    InvalidInputError | BreakNotFoundError | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const decodedId = yield* decodeOrFail(BreakId)(params.breakId)

      const breakEntity = yield* this.repositoryFactory.breakRepository.findById(decodedId)

      if (Option.isNone(breakEntity)) {
        return yield* Effect.fail(
          new BreakNotFoundError({
            message: `Break with ID ${params.breakId} not found`,
            cause: `Break with ID ${params.breakId} not found`,
          }),
        )
      }

      return breakEntity.value
    })
  }
}