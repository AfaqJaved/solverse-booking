import { Injectable } from '@nestjs/common'
import {
  DatabaseFailure,
  UserEmail,
  EmailAlreadyTakenError,
  FullName,
  InvalidInputError,
  UserPhoneNumber,
  RegisterUserUsecase,
  UserTimezone,
  User,
  UserId,
  UserRole,
  UserRoleType,
  Username,
} from '@solverse/domain'
import { RepositoryFactory } from '@solverse/persistence'
import { Effect, Option, Schema } from 'effect'
import { HashUtils } from '../../../lib/hash/entry'
import { decodeOrFail } from '../../../lib/utils/decode.or.fail'

@Injectable()
export class RegisterUserUsecaseImpl implements RegisterUserUsecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    username,
    password,
    name,
    email,
    role,
    timezone,
    phone,
  }: {
    username: string
    password: string
    name: { firstName: string; lastName: string }
    email: string
    role: UserRoleType
    timezone: string
    phone?: string
  }): Effect.Effect<
    { id: string },
    InvalidInputError | EmailAlreadyTakenError | DatabaseFailure
  > {
    return Effect.gen(this, function* () {
      const id = yield* decodeOrFail(UserId)(crypto.randomUUID())
      const decodedUsername = yield* decodeOrFail(Username)(username)
      const decodedEmail = yield* decodeOrFail(UserEmail)(email)
      const decodedName = yield* decodeOrFail(FullName)(name)
      const decodedTimezone = yield* decodeOrFail(UserTimezone)(timezone)
      const decodedRole = yield* decodeOrFail(UserRole)(role)
      const decodedPhone =
        phone != null ? yield* decodeOrFail(UserPhoneNumber)(phone) : undefined

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

      const hashedPassword = yield* HashUtils.hash(password).pipe(Effect.orDie)

      const user = User.create({
        id,
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

      yield* this.repositoryFactory.userRepository.save(user)

      return { id: user.id }
    })
  }
}
