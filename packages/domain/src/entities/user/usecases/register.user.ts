import { Effect } from 'effect'
import { DatabaseFailure } from '../../../errors/entry'
import { EmailAlreadyTakenError } from '../errors/entry'
import type { UserId, FullName, Username } from '../value-objects/entry'
import type { Email, PhoneNumber, Timezone } from '../../common/entry'
import type { UserData } from '../user.entity'

export const IRegisterUserUsecase = Symbol('IRegisterUserUsecase')

export interface RegisterUserUsecase {
  execute(params: {
    id: UserId
    username: Username
    password: string
    name: FullName
    email: Email
    role: UserData['role']
    timezone: Timezone
    phone?: PhoneNumber
  }): Effect.Effect<{ id: UserId }, EmailAlreadyTakenError | DatabaseFailure>
}
