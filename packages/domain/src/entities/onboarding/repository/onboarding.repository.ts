import { Effect } from 'effect'
import { User } from '../../user/entry'
import { Business } from '../../business/entry'
import { WorkingHours } from '../../working-hours/entry'
import { Break } from '../../break/entry'
import { TimeOff } from '../../timeoff/entry'
import { Service } from '../../service/entry'
import { DatabaseFailure } from '../../../errors/entry'

export const IOnboardingRepository = Symbol('IOnboardingRepository')

export interface OnboardingRepository {
  save(params: {
    user: User
    business: Business
    workingHours: WorkingHours[]
    breaks: Break[]
    timeOffs: TimeOff[]
    services: Service[]
  }): Effect.Effect<void, DatabaseFailure>
}
