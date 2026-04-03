import {
  BreakRepository,
  BusinessRepository,
  IBreakRepository,
  IBusinessRepository,
  IServiceRepository,
  IUserRepository,
  IWorkingHoursRepository,
  ServiceRepository,
  UserRepository,
  WorkingHoursRepository,
} from '@solverse/domain'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class RepositoryFactory {
  @Inject(IUserRepository)
  public readonly userRepository!: UserRepository
  @Inject(IBusinessRepository)
  public readonly businessRepository!: BusinessRepository
  @Inject(IServiceRepository)
  public readonly serviceRepository!: ServiceRepository
  @Inject(IWorkingHoursRepository)
  public readonly workingHoursRepository!: WorkingHoursRepository
  @Inject(IBreakRepository)
  public readonly breakRepository!: BreakRepository
}
