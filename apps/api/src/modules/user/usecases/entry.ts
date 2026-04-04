import { Provider } from '@nestjs/common'
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
} from '@solverse/domain'
import { LoginUserUsecaseImpl } from './login.user.usecase.impl'
import { RegisterUserUsecaseImpl } from './register.user.usecase.impl'
import { VerifyEmailUsecaseImpl } from './verify.email.usecase.impl'
import { GetUserUsecaseImpl } from './get.user.usecase.impl'
import { UpdateProfileUsecaseImpl } from './update.profile.usecase.impl'
import { ChangeEmailUsecaseImpl } from './change.email.usecase.impl'
import { DeactivateUserUsecaseImpl } from './deactivate.user.usecase.impl'
import { ReactivateUserUsecaseImpl } from './reactivate.user.usecase.impl'
import { SuspendUserUsecaseImpl } from './suspend.user.usecase.impl'

export const USER_USECASES: Provider[] = [
  { provide: ILoginUserUsecase, useClass: LoginUserUsecaseImpl },
  { provide: IRegisterUserUsecase, useClass: RegisterUserUsecaseImpl },
  { provide: IVerifyEmailUsecase, useClass: VerifyEmailUsecaseImpl },
  { provide: IGetUserUsecase, useClass: GetUserUsecaseImpl },
  { provide: IUpdateProfileUsecase, useClass: UpdateProfileUsecaseImpl },
  { provide: IChangeEmailUsecase, useClass: ChangeEmailUsecaseImpl },
  { provide: IDeactivateUserUsecase, useClass: DeactivateUserUsecaseImpl },
  { provide: IReactivateUserUsecase, useClass: ReactivateUserUsecaseImpl },
  { provide: ISuspendUserUsecase, useClass: SuspendUserUsecaseImpl },
]
