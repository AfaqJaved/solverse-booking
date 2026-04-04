import { Inject, Injectable } from '@nestjs/common'
import {
  ILoginUserUsecase,
  IRegisterUserUsecase,
  IVerifyEmailUsecase,
  IGetUserUsecase,
  IUpdateProfileUsecase,
  IChangeEmailUsecase,
  IDeactivateUserUsecase,
  IReactivateUserUsecase,
  ISuspendUserUsecase,
  LoginUserUsecase,
  RegisterUserUsecase,
  VerifyEmailUsecase,
  GetUserUsecase,
  UpdateProfileUsecase,
  ChangeEmailUsecase,
  DeactivateUserUsecase,
  ReactivateUserUsecase,
  SuspendUserUsecase,
} from '@solverse/domain'

@Injectable()
export class UserUsecaseFactory {
  @Inject(ILoginUserUsecase)
  public readonly loginUserUsecase!: LoginUserUsecase

  @Inject(IRegisterUserUsecase)
  public readonly registerUserUsecase!: RegisterUserUsecase

  @Inject(IVerifyEmailUsecase)
  public readonly verifyEmailUsecase!: VerifyEmailUsecase

  @Inject(IGetUserUsecase)
  public readonly getUserUsecase!: GetUserUsecase

  @Inject(IUpdateProfileUsecase)
  public readonly updateProfileUsecase!: UpdateProfileUsecase

  @Inject(IChangeEmailUsecase)
  public readonly changeEmailUsecase!: ChangeEmailUsecase

  @Inject(IDeactivateUserUsecase)
  public readonly deactivateUserUsecase!: DeactivateUserUsecase

  @Inject(IReactivateUserUsecase)
  public readonly reactivateUserUsecase!: ReactivateUserUsecase

  @Inject(ISuspendUserUsecase)
  public readonly suspendUserUsecase!: SuspendUserUsecase
}
