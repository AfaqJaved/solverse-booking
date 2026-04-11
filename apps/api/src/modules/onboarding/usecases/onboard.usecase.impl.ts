import { Injectable } from '@nestjs/common'
import { Effect } from 'effect'
import { OnboardingApi } from '@solverse/shared'
import {
  DatabaseFailure,
  InvalidInputError,
  EmailAlreadyTakenError,
  BusinessSlugTakenError,
  WorkingHoursDayTakenError,
  BreakTimeConflictError,
  TimeOffDateRangeError,
  TimeOffTimeRangeError,
  TimeOffAlreadyActiveError,
  TimeOffAlreadyCancelledError,
  TimeOffDeletedError,
  ServiceNameTakenError,
} from '@solverse/domain'
import { UserUsecaseFactory } from '../../user/usecases/user.usecases.factory'
import { BusinessUsecasesFactory } from '../../business/usecases/entry'
import { WorkingHoursUsecasesFactory } from '../../working-hours/usecases/entry'
import { BreakUsecasesFactory } from '../../break/usecases/entry'
import { TimeOffUsecaseFactory } from '../../timeoff/usecases/timeoff.usecases.factory'
import { ServiceUsecasesFactory } from '../../service/usecases/entry'

export type OnboardError =
  | InvalidInputError
  | EmailAlreadyTakenError
  | BusinessSlugTakenError
  | WorkingHoursDayTakenError
  | BreakTimeConflictError
  | TimeOffDateRangeError
  | TimeOffTimeRangeError
  | TimeOffAlreadyActiveError
  | TimeOffAlreadyCancelledError
  | TimeOffDeletedError
  | ServiceNameTakenError
  | DatabaseFailure

@Injectable()
export class OnboardUsecaseImpl {
  constructor(
    private readonly userFactory: UserUsecaseFactory,
    private readonly businessFactory: BusinessUsecasesFactory,
    private readonly workingHoursFactory: WorkingHoursUsecasesFactory,
    private readonly breakFactory: BreakUsecasesFactory,
    private readonly timeOffFactory: TimeOffUsecaseFactory,
    private readonly serviceFactory: ServiceUsecasesFactory,
  ) {}

  execute(
    params: OnboardingApi.Register.Request,
  ): Effect.Effect<OnboardingApi.Register.Response, OnboardError> {
    return Effect.gen(this, function* () {
      // Step 1: Register user as businessOwner
      const { id: userId } =
        yield* this.userFactory.registerUserUsecase.execute({
          username: params.owner.username,
          password: params.owner.password,
          name: {
            firstName: params.owner.firstName,
            lastName: params.owner.lastName,
          },
          email: params.owner.email,
          role: 'businessOwner',
          timezone: params.owner.timezone,
          phone: params.owner.phone,
        })

      // Step 2: Register business
      const { id: businessId } =
        yield* this.businessFactory.registerBusinessUsecase.execute({
          ownerId: userId,
          name: params.business.name,
          slug: params.business.slug,
          email: params.business.email,
          timezone: params.business.timezone,
          currency: params.business.currency,
          phone: params.business.phone,
        })

      // Step 3: Create working hours (one record per day)
      const workingHoursIdMap = new Map<string, string>()

      for (const schedule of params.workingHours) {
        const wh =
          yield* this.workingHoursFactory.createWorkingHoursUsecase.execute({
            id: crypto.randomUUID(),
            businessId,
            dayOfWeek: schedule.day,
            isOpen: schedule.isOpen,
            openTime: schedule.openTime ?? null,
            closeTime: schedule.closeTime ?? null,
            createdBy: userId,
          })
        workingHoursIdMap.set(schedule.day, wh.id)
      }

      // Step 4: Create breaks (optional)
      if (params.breaks && params.breaks.length > 0) {
        for (const br of params.breaks) {
          const workingHoursId = workingHoursIdMap.get(br.day)
          if (!workingHoursId) continue
          yield* this.breakFactory.createBreakUsecase.execute({
            id: br.id,
            workingHoursId,
            label: br.label,
            startTime: br.startTime,
            endTime: br.endTime,
            createdBy: userId,
          })
        }
      }

      // Step 5: Create time offs (optional)
      if (params.timeOffs && params.timeOffs.length > 0) {
        for (const to of params.timeOffs) {
          yield* this.timeOffFactory.createTimeOffUsecase.execute({
            businessId,
            label: to.label,
            allDay: to.allDay,
            cadence: to.cadence,
            startDate: new Date(to.startDate),
            endDate: new Date(to.endDate),
            startTime: to.startTime ?? null,
            endTime: to.endTime ?? null,
            actorId: userId,
          })
        }
      }

      // Step 6: Create services (optional)
      if (params.services && params.services.length > 0) {
        for (const svc of params.services) {
          yield* this.serviceFactory.createServiceUsecase.execute({
            id: svc.id,
            businessId,
            name: svc.name,
            duration: svc.duration,
            price: svc.price,
            createdBy: userId,
            description: svc.description ?? null,
          })
        }
      }

      return { userId, businessId }
    })
  }
}
