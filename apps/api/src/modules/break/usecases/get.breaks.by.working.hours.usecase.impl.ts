import { Injectable } from '@nestjs/common'
import {
  Break,
  WorkingHoursId,
  DatabaseFailure,
  InvalidInputError,
  GetBreaksByWorkingHoursUsecase,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class GetBreaksByWorkingHoursUsecaseImpl implements GetBreaksByWorkingHoursUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute(params: {
    workingHoursId: string
  }): Effect.Effect<Break[], InvalidInputError | DatabaseFailure> {
    return Effect.gen(this, function* () {
      const decodedWorkingHoursId = yield* decodeOrFail(WorkingHoursId)(params.workingHoursId)

      const breaks = yield* this.repositoryFactory.breakRepository.findByWorkingHoursId(
        decodedWorkingHoursId,
        {
          includeDeleted: false,
        }
      )

      return breaks
    })
  }
}