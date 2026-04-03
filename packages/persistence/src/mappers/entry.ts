import { BreakPersistenceMapper } from './break.persistence.mapper'
import { BusinessPersistenceMapper } from './business.persistence.mapper'
import { ServicePersistenceMapper } from './service.persistence.mapper'
import { UserPersistenceMapper } from './user.persistence.mapper'
import { WorkingHoursPersistenceMapper } from './working.hours.persistence.mapper'

export const PERSITENCE_MAPPPERS = [
  UserPersistenceMapper,
  BreakPersistenceMapper,
  ServicePersistenceMapper,
  UserPersistenceMapper,
  WorkingHoursPersistenceMapper,
  BusinessPersistenceMapper,
]
