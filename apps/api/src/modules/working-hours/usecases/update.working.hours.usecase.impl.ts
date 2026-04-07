import { Injectable } from '@nestjs/common'
import {
  WorkingHours,
  WorkingHoursId,
  DatabaseFailure,
  InvalidInputError,
  UpdateWorkingHoursUsecase,
  WorkingHoursNotFoundError,
  WorkingHoursDeletedError,
  UserId,
  WorkingHoursTimeOfDay,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class UpdateWorkingHoursUsecaseImpl implements UpdateWorkingHoursUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    id,
    isOpen,
    openTime,
    closeTime,
    updatedBy,
  }: {
    id: string
    isOpen?: boolean
    openTime?: string | null
    closeTime?: string | null
    updatedBy: string
  }): Effect.Effect<
    WorkingHours,
    | InvalidInputError
    | DatabaseFailure
    | WorkingHoursNotFoundError
    | WorkingHoursDeletedError
  > {
    return Effect.gen(this, function* () {
      const decodedId = yield* decodeOrFail(WorkingHoursId)(id)
      const updatedByUserId = yield* decodeOrFail(UserId)(updatedBy)

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

      let updatedWorkingHours = workingHours

      if (isOpen !== undefined) {
        if (isOpen) {
          if (
            openTime === null ||
            closeTime === null ||
            openTime === undefined ||
            closeTime === undefined
          ) {
            return yield* Effect.fail(
              new InvalidInputError({
                message:
                  'openTime and closeTime are required when isOpen is true',
                cause:
                  'openTime and closeTime are required when isOpen is true',
              }),
            )
          }
          const decodedOpenTime = yield* decodeOrFail(WorkingHoursTimeOfDay)(
            openTime,
          )
          const decodedCloseTime = yield* decodeOrFail(WorkingHoursTimeOfDay)(
            closeTime,
          )
          const result = workingHours.setOpen(
            decodedOpenTime,
            decodedCloseTime,
            updatedByUserId,
          )
          if (Effect.isFailure(result)) {
            return yield* result
          }
          updatedWorkingHours = yield* result
        } else {
          const result = workingHours.setClosed(updatedByUserId)
          if (Effect.isFailure(result)) {
            return yield* result
          }
          updatedWorkingHours = yield* result
        }
      } else if (openTime !== undefined || closeTime !== undefined) {
        if (!workingHours.isOpen) {
          return yield* Effect.fail(
            new InvalidInputError({
              message: 'Cannot set open/close times when isOpen is false',
              cause: 'Cannot set open/close times when isOpen is false',
            }),
          )
        }

        const currentOpenTime = workingHours.openTime
        const currentCloseTime = workingHours.closeTime

        let newOpenTime = currentOpenTime
        let newCloseTime = currentCloseTime

        if (openTime !== undefined) {
          if (openTime === null) {
            return yield* Effect.fail(
              new InvalidInputError({
                message: 'openTime cannot be null when isOpen is true',
                cause: 'openTime cannot be null when isOpen is true',
              }),
            )
          }
          newOpenTime = yield* decodeOrFail(WorkingHoursTimeOfDay)(openTime)
        }

        if (closeTime !== undefined) {
          if (closeTime === null) {
            return yield* Effect.fail(
              new InvalidInputError({
                message: 'closeTime cannot be null when isOpen is true',
                cause: 'closeTime cannot be null when isOpen is true',
              }),
            )
          }
          newCloseTime = yield* decodeOrFail(WorkingHoursTimeOfDay)(closeTime)
        }

        if (newOpenTime === null || newCloseTime === null) {
          return yield* Effect.fail(
            new InvalidInputError({
              message:
                'openTime and closeTime cannot be null when isOpen is true',
              cause:
                'openTime and closeTime cannot be null when isOpen is true',
            }),
          )
        }

        const result = workingHours.setOpen(
          newOpenTime,
          newCloseTime,
          updatedByUserId,
        )
        if (Effect.isFailure(result)) {
          return yield* result
        }
        updatedWorkingHours = yield* result
      }

      yield* this.repositoryFactory.workingHoursRepository.save(
        updatedWorkingHours,
      )

      return updatedWorkingHours
    })
  }
}
