import { Effect } from 'effect'
import {
  User,
  Business,
  WorkingHours,
  Break,
  TimeOff,
  Service,
  OnboardingRepository,
  DatabaseFailure,
} from '@solverse/domain'
import { PersistenceMapperFactory } from '../mappers/persistence.mapper.factory'
import { usersTable } from '../schema/user.table'
import { businessesTable } from '../schema/business.table'
import { workingHoursTable } from '../schema/working.hours.table'
import { breaksTable } from '../schema/break.table'
import { timeoffsTable } from '../schema/timeoff.table'
import { servicesTable } from '../schema/service.table'
import { dbEffect, db } from '../connection/entry'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnboardingRepositoryImpl implements OnboardingRepository {
  constructor(
    private readonly persistenceMapperFactory: PersistenceMapperFactory,
  ) {}

  save(params: {
    user: User
    business: Business
    workingHours: WorkingHours[]
    breaks: Break[]
    timeOffs: TimeOff[]
    services: Service[]
  }): Effect.Effect<void, DatabaseFailure> {
    const mapper = this.persistenceMapperFactory

    const userRow = mapper.userPersistenceMapper.toPersistence(params.user)
    const businessRow = mapper.businessPersistenceMapper.toPersistence(params.business)
    const workingHoursRows = params.workingHours.map((wh) =>
      mapper.workingHoursPersistenceMapper.toPersistence(wh),
    )
    const breakRows = params.breaks.map((br) =>
      mapper.breakPersistenceMapper.toPersistence(br),
    )
    const timeOffRows = params.timeOffs.map((to) =>
      mapper.timeOffPersistenceMapper.toPersistence(to),
    )
    const serviceRows = params.services.map((svc) =>
      mapper.servicePersistenceMapper.toPersistence(svc),
    )

    return dbEffect(
      db.transaction(async (tx) => {
        await tx.insert(usersTable).values(userRow)
        await tx.insert(businessesTable).values(businessRow)

        for (const row of workingHoursRows) {
          await tx.insert(workingHoursTable).values(row)
        }

        for (const row of breakRows) {
          await tx.insert(breaksTable).values(row)
        }

        for (const row of timeOffRows) {
          await tx.insert(timeoffsTable).values(row)
        }

        for (const row of serviceRows) {
          await tx.insert(servicesTable).values(row)
        }
      }),
    )
  }
}
