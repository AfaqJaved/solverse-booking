import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  EmailAlreadyTakenError,
  FullName,
  RegisterUserUsecase,
  User,
  UserId,
  Username,
  UserData,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option } from 'effect'
import { HashUtils } from '../../../lib/hash/entry'
import type { Email, PhoneNumber, Timezone, UserRole } from '@solverse/domain'

@Injectable()
export class RegisterUserUsecaseImpl implements RegisterUserUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    id,
    username,
    password,
    name,
    email,
    role,
    timezone,
    phone,
  }: {
    id: UserId
    username: Username
    password: string
    name: FullName
    email: Email
    role: UserRole
    timezone: Timezone
    phone?: PhoneNumber
  }): Effect.Effect<{ id: UserId }, EmailAlreadyTakenError | DatabaseFailure> {
    return Effect.gen(this, function* () {
      const existingByEmail =
        yield* this.repositoryFactory.userRepository.findByEmail(email)

      if (Option.isSome(existingByEmail)) {
        return yield* Effect.fail(
          new EmailAlreadyTakenError({
            message: `Email ${email} is already taken`,
            cause: `Email ${email} is already taken`,
          }),
        )
      }

      const existingByUsername =
        yield* this.repositoryFactory.userRepository.findByUsernameOrEmail(
          username,
        )

      if (Option.isSome(existingByUsername)) {
        return yield* Effect.fail(
          new EmailAlreadyTakenError({
            message: `Username ${username} is already taken`,
            cause: `Username ${username} is already taken`,
          }),
        )
      }

      // Hash failures are infrastructure defects — die rather than expose to domain
      const hashedPassword = yield* HashUtils.hash(password).pipe(Effect.orDie)

      const user = User.create({
        id,
        username,
        password: hashedPassword as Parameters<
          typeof User.create
        >[0]['password'],
        name,
        email,
        role,
        timezone,
        phone,
      })

      yield* this.repositoryFactory.userRepository.save(user)

      return { id: user.id }
    })
  }
}
