import { Inject, Injectable } from '@nestjs/common'
import { ILoginUserUsecase, LoginUserUsecase } from '@solverse/domain'

@Injectable()
export class UserUsecaseFactory {
  @Inject(ILoginUserUsecase) public readonly loginUserUsecase!: LoginUserUsecase
}
