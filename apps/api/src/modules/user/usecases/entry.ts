import { Provider } from '@nestjs/common'
import { ILoginUserUsecase } from '@solverse/domain'
import { LoginUserUsecaseImpl } from './login.user.usecase.impl'

export const USER_USECASES: Provider[] = [
  { provide: ILoginUserUsecase, useClass: LoginUserUsecaseImpl },
]
