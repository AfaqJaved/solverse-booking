import { Inject, Injectable } from '@nestjs/common'
import { UserPersistenceMapper } from './user.persistence.mapper'

@Injectable()
export class PersistenceMapperFactory {
  @Inject(UserPersistenceMapper)
  public userPersistenceMapper!: UserPersistenceMapper
}
