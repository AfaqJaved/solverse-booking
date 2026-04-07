import { Injectable } from '@nestjs/common'
import {
  WorkingHours,
  BusinessId,
  DatabaseFailure,
  InvalidInputError,
  ListWorkingHoursByBusinessUsecase,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class ListWorkingHoursByBusinessUsecaseImpl implements ListWorkingHoursByBusinessUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    businessId,
  }: {
    businessId: string
  }): Effect.Effect<WorkingHours[], InvalidInputError | DatabaseFailure> {
    return Effect.gen(this, function* () {
      const decodedBusinessId = yield* decodeOrFail(BusinessId)(businessId)

      const workingHours =
        yield* this.repositoryFactory.workingHoursRepository.findByBusinessId(
          decodedBusinessId,
        )

      return workingHours
    })
  }
}
