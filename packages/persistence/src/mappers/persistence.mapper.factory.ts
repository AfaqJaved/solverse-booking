import { Inject, Injectable } from '@nestjs/common'
import { UserPersistenceMapper } from './user.persistence.mapper'
import { BusinessPersistenceMapper } from './business.persistence.mapper'
import { ServicePersistenceMapper } from './service.persistence.mapper'
import { WorkingHoursPersistenceMapper } from './working.hours.persistence.mapper'
import { BreakPersistenceMapper } from './break.persistence.mapper'
import { TimeOffPersistenceMapper } from './timeoff.persistence.mapper'

@Injectable()
export class PersistenceMapperFactory {
  @Inject(UserPersistenceMapper)
  public userPersistenceMapper!: UserPersistenceMapper

  @Inject(BusinessPersistenceMapper)
  public businessPersistenceMapper!: BusinessPersistenceMapper

  @Inject(ServicePersistenceMapper)
  public servicePersistenceMapper!: ServicePersistenceMapper

  @Inject(WorkingHoursPersistenceMapper)
  public workingHoursPersistenceMapper!: WorkingHoursPersistenceMapper

  @Inject(BreakPersistenceMapper)
  public breakPersistenceMapper!: BreakPersistenceMapper

  @Inject(TimeOffPersistenceMapper)
  public timeOffPersistenceMapper!: TimeOffPersistenceMapper
}
