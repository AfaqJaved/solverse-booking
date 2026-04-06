import { Injectable } from '@nestjs/common'
import {
  Business,
  DatabaseFailure,
  GetBusinessesByOwnerUsecase,
  InvalidInputError,
  UserId,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class GetBusinessesByOwnerUsecaseImpl implements GetBusinessesByOwnerUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    ownerId,
  }: {
    ownerId: string
  }): Effect.Effect<Business[], InvalidInputError | DatabaseFailure> {
    return Effect.gen(this, function* () {
      const decodedOwnerId = yield* decodeOrFail(UserId)(ownerId)

      return yield* this.repositoryFactory.businessRepository.findByOwnerId(
        decodedOwnerId,
      )
    })
  }
}
