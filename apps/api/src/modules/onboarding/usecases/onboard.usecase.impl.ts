import { Injectable } from '@nestjs/common'
import { Effect, Option } from 'effect'
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
  User,
  UserId,
  Username,
  UserEmail,
  FullName,
  UserTimezone,
  UserRole,
  UserPhoneNumber,
  Business,
  BusinessId,
  BusinessName,
  BusinessSlug,
  BusinessEmail,
  BusinessTimezone,
  BusinessCurrency,
  BusinessPhoneNumber,
  WorkingHours,
  WorkingHoursId,
  DayOfWeek,
  WorkingHoursTimeOfDay,
  Break,
  BreakId,
  BreakTimeOfDay,
  TimeOff,
  TimeOffId,
  TimeOffLabel,
  TimeOffCadence,
  TimeOffTimeOfDay as TimeOffTimeOfDaySchema,
  Service,
  ServiceId,
  ServiceName,
  ServiceDuration,
  ServicePrice,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'
import { HashUtils } from '../../../lib/hash/entry'

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
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute(
    params: OnboardingApi.Register.Request,
  ): Effect.Effect<OnboardingApi.Register.Response, OnboardError> {
    return Effect.gen(this, function* () {
      const { user, userId } = yield* this.buildUser(params.owner)

      // user domain object
      const { business, businessId } = yield* this.buildBusiness(
        params.business,
        userId,
      )

      // working hours domain object
      const { workingHoursList, workingHoursIdMap } =
        yield* this.buildWorkingHours(params.workingHours, businessId, userId)

      // break list domain object
      const breakList = yield* this.buildBreaks(
        params.breaks ?? [],
        workingHoursIdMap,
        userId,
      )

      // timeoff list domain object
      const timeOffList = yield* this.buildTimeOffs(
        params.timeOffs ?? [],
        businessId,
      )

      // service list domain object
      const serviceList = yield* this.buildServices(
        params.services ?? [],
        businessId,
        userId,
      )

      yield* this.repositoryFactory.onboardingRepository.save({
        user,
        business,
        workingHours: workingHoursList,
        breaks: breakList,
        timeOffs: timeOffList,
        services: serviceList,
      })

      return { userId, businessId }
    }) as Effect.Effect<OnboardingApi.Register.Response, OnboardError>
  }

  private buildUser(
    owner: OnboardingApi.Register.Request['owner'],
  ): Effect.Effect<
    { user: User; userId: UserId },
    InvalidInputError | EmailAlreadyTakenError | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const userId = yield* decodeOrFail(UserId)(crypto.randomUUID())
      const decodedUsername = yield* decodeOrFail(Username)(owner.username)
      const decodedEmail = yield* decodeOrFail(UserEmail)(owner.email)
      const decodedName = yield* decodeOrFail(FullName)({
        firstName: owner.firstName,
        lastName: owner.lastName,
      })
      const decodedTimezone = yield* decodeOrFail(UserTimezone)(owner.timezone)
      const decodedRole = yield* decodeOrFail(UserRole)('businessOwner')
      const decodedPhone =
        owner.phone != null
          ? yield* decodeOrFail(UserPhoneNumber)(owner.phone)
          : undefined

      const existingByEmail =
        yield* this.repositoryFactory.userRepository.findByEmail(decodedEmail)
      if (Option.isSome(existingByEmail)) {
        return yield* Effect.fail(
          new EmailAlreadyTakenError({
            message: `Email ${decodedEmail} is already taken`,
            cause: `Email ${decodedEmail} is already taken`,
          }),
        )
      }

      const existingByUsername =
        yield* this.repositoryFactory.userRepository.findByUsernameOrEmail(
          decodedUsername,
        )
      if (Option.isSome(existingByUsername)) {
        return yield* Effect.fail(
          new EmailAlreadyTakenError({
            message: `Username ${decodedUsername} is already taken`,
            cause: `Username ${decodedUsername} is already taken`,
          }),
        )
      }

      const hashedPassword = yield* HashUtils.hash(owner.password).pipe(
        Effect.orDie,
      )

      const user = User.create({
        id: userId,
        username: decodedUsername,
        password: hashedPassword as Parameters<
          typeof User.create
        >[0]['password'],
        name: decodedName,
        email: decodedEmail,
        role: decodedRole,
        timezone: decodedTimezone,
        phone: decodedPhone,
      })

      return { user, userId }
    })
  }

  private buildBusiness(
    businessParams: OnboardingApi.Register.Request['business'],
    ownerId: UserId,
  ): Effect.Effect<
    { business: Business; businessId: BusinessId },
    InvalidInputError | BusinessSlugTakenError | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const businessId = yield* decodeOrFail(BusinessId)(crypto.randomUUID())
      const decodedName = yield* decodeOrFail(BusinessName)(businessParams.name)
      const decodedSlug = yield* decodeOrFail(BusinessSlug)(businessParams.slug)
      const decodedEmail = yield* decodeOrFail(BusinessEmail)(
        businessParams.email,
      )
      const decodedTimezone = yield* decodeOrFail(BusinessTimezone)(
        businessParams.timezone,
      )
      const decodedCurrency = yield* decodeOrFail(BusinessCurrency)(
        businessParams.currency,
      )
      const decodedPhone =
        businessParams.phone != null
          ? yield* decodeOrFail(BusinessPhoneNumber)(businessParams.phone)
          : undefined

      const slugTaken =
        yield* this.repositoryFactory.businessRepository.slugExists(decodedSlug)
      if (slugTaken) {
        return yield* Effect.fail(
          new BusinessSlugTakenError({
            message: `Slug "${decodedSlug}" is already taken`,
            cause: `Slug "${decodedSlug}" is already taken`,
          }),
        )
      }

      const business = Business.create({
        id: businessId,
        ownerId,
        name: decodedName,
        slug: decodedSlug,
        email: decodedEmail,
        timezone: decodedTimezone,
        currency: decodedCurrency,
        phone: decodedPhone,
      })

      return { business, businessId }
    })
  }

  private buildWorkingHours(
    schedules: OnboardingApi.Register.Request['workingHours'],
    businessId: BusinessId,
    createdBy: UserId,
  ): Effect.Effect<
    {
      workingHoursList: WorkingHours[]
      workingHoursIdMap: Map<string, WorkingHoursId>
    },
    InvalidInputError | WorkingHoursDayTakenError | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const workingHoursList: WorkingHours[] = []
      const workingHoursIdMap = new Map<string, WorkingHoursId>()

      for (const schedule of schedules) {
        const whId = yield* decodeOrFail(WorkingHoursId)(crypto.randomUUID())
        const decodedDay = yield* decodeOrFail(DayOfWeek)(schedule.day)

        let decodedOpenTime: WorkingHoursTimeOfDay | null = null
        let decodedCloseTime: WorkingHoursTimeOfDay | null = null

        if (schedule.isOpen) {
          if (schedule.openTime) {
            decodedOpenTime = yield* decodeOrFail(WorkingHoursTimeOfDay)(
              schedule.openTime,
            )
          }
          if (schedule.closeTime) {
            decodedCloseTime = yield* decodeOrFail(WorkingHoursTimeOfDay)(
              schedule.closeTime,
            )
          }
        }

        const dayTaken =
          yield* this.repositoryFactory.workingHoursRepository.dayExistsForBusiness(
            businessId,
            decodedDay,
          )
        if (dayTaken) {
          return yield* Effect.fail(
            new WorkingHoursDayTakenError({
              message: `Working hours for ${decodedDay} already exist for this business`,
              cause: `Working hours for ${decodedDay} already exist for this business`,
            }),
          )
        }

        const wh = WorkingHours.create({
          id: whId,
          businessId,
          dayOfWeek: decodedDay,
          isOpen: schedule.isOpen,
          openTime: decodedOpenTime,
          closeTime: decodedCloseTime,
          createdBy,
        })

        workingHoursList.push(wh)
        workingHoursIdMap.set(schedule.day, whId)
      }

      return { workingHoursList, workingHoursIdMap }
    })
  }

  private buildBreaks(
    breaks: NonNullable<OnboardingApi.Register.Request['breaks']>,
    workingHoursIdMap: Map<string, WorkingHoursId>,
    createdBy: UserId,
  ): Effect.Effect<
    Break[],
    InvalidInputError | BreakTimeConflictError | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const breakList: Break[] = []

      for (const br of breaks) {
        const workingHoursId = workingHoursIdMap.get(br.day)
        if (!workingHoursId) continue

        const decodedBreakId = yield* decodeOrFail(BreakId)(br.id)
        const decodedWorkingHoursId =
          yield* decodeOrFail(WorkingHoursId)(workingHoursId)
        const decodedStartTime = yield* decodeOrFail(BreakTimeOfDay)(
          br.startTime,
        )
        const decodedEndTime = yield* decodeOrFail(BreakTimeOfDay)(br.endTime)

        const hasConflict =
          yield* this.repositoryFactory.breakRepository.hasTimeConflict(
            decodedWorkingHoursId,
            decodedStartTime,
            decodedEndTime,
            decodedBreakId,
          )
        if (hasConflict) {
          return yield* Effect.fail(
            new BreakTimeConflictError({
              message: `Break time conflicts with existing break for working hours`,
              cause: `Break time ${decodedStartTime}-${decodedEndTime} conflicts with existing break`,
            }),
          )
        }

        breakList.push(
          Break.create({
            id: decodedBreakId,
            workingHoursId: decodedWorkingHoursId,
            label: br.label,
            startTime: decodedStartTime,
            endTime: decodedEndTime,
            createdBy,
          }),
        )
      }

      return breakList
    })
  }

  private buildTimeOffs(
    timeOffs: NonNullable<OnboardingApi.Register.Request['timeOffs']>,
    businessId: BusinessId,
  ): Effect.Effect<
    TimeOff[],
    | InvalidInputError
    | TimeOffDateRangeError
    | TimeOffTimeRangeError
    | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const timeOffList: TimeOff[] = []

      for (const to of timeOffs) {
        const timeOffId = yield* decodeOrFail(TimeOffId)(crypto.randomUUID())
        const decodedLabel = yield* decodeOrFail(TimeOffLabel)(to.label)
        const decodedCadence = yield* decodeOrFail(TimeOffCadence)(to.cadence)

        let decodedStartTime: typeof TimeOffTimeOfDaySchema.Type | null = null
        let decodedEndTime: typeof TimeOffTimeOfDaySchema.Type | null = null

        if (!to.allDay) {
          if (!to.startTime || !to.endTime) {
            return yield* Effect.fail(
              new InvalidInputError({
                message:
                  'startTime and endTime are required when allDay is false',
                cause: 'Missing required time fields',
              }),
            )
          }
          decodedStartTime = yield* decodeOrFail(TimeOffTimeOfDaySchema)(
            to.startTime,
          )
          decodedEndTime = yield* decodeOrFail(TimeOffTimeOfDaySchema)(
            to.endTime,
          )
          if (to.startTime >= to.endTime) {
            return yield* Effect.fail(
              new TimeOffTimeRangeError({
                message: 'startTime must be before endTime',
                startTime: to.startTime,
                endTime: to.endTime,
              }),
            )
          }
        } else {
          if (to.startTime !== null || to.endTime !== null) {
            return yield* Effect.fail(
              new InvalidInputError({
                message:
                  'startTime and endTime must be null when allDay is true',
                cause: 'Time fields should be null for all-day time off',
              }),
            )
          }
        }

        const startDate = new Date(to.startDate)
        const endDate = new Date(to.endDate)

        if (startDate > endDate) {
          return yield* Effect.fail(
            new TimeOffDateRangeError({
              message: 'startDate must be before or equal to endDate',
              startDate,
              endDate,
            }),
          )
        }

        const hasOverlap =
          yield* this.repositoryFactory.timeOffRepository.hasOverlappingTimeOff(
            businessId,
            startDate,
            endDate,
            decodedStartTime,
            decodedEndTime,
          )
        if (hasOverlap) {
          return yield* Effect.fail(
            new InvalidInputError({
              message:
                'Time off overlaps with existing time off for this business',
              cause: 'Overlapping time off',
            }),
          )
        }

        const timeOff = yield* TimeOff.create({
          id: timeOffId,
          businessId,
          label: decodedLabel,
          allDay: to.allDay,
          cadence: decodedCadence,
          startDate,
          endDate,
          startTime: decodedStartTime,
          endTime: decodedEndTime,
        })

        timeOffList.push(timeOff)
      }

      return timeOffList
    })
  }

  private buildServices(
    services: NonNullable<OnboardingApi.Register.Request['services']>,
    businessId: BusinessId,
    createdBy: UserId,
  ): Effect.Effect<
    Service[],
    InvalidInputError | ServiceNameTakenError | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const serviceList: Service[] = []

      for (const svc of services) {
        const decodedId = yield* decodeOrFail(ServiceId)(svc.id)
        const decodedName = yield* decodeOrFail(ServiceName)(svc.name)
        const decodedDuration = yield* decodeOrFail(ServiceDuration)(
          svc.duration,
        )
        const decodedPrice = yield* decodeOrFail(ServicePrice)(svc.price)

        const nameTaken =
          yield* this.repositoryFactory.serviceRepository.nameExistsForBusiness(
            businessId,
            decodedName,
          )
        if (nameTaken) {
          return yield* Effect.fail(
            new ServiceNameTakenError({
              message: `Service name "${decodedName}" is already taken for this business`,
              cause: `Service name "${decodedName}" is already taken for this business`,
            }),
          )
        }

        serviceList.push(
          Service.create({
            id: decodedId,
            businessId,
            name: decodedName,
            duration: decodedDuration,
            price: decodedPrice,
            createdBy,
            description: svc.description ?? null,
          }),
        )
      }

      return serviceList
    })
  }
}
