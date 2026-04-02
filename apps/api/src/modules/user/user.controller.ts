import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { Effect } from 'effect'
import { UserUsecaseFactory } from './usecases/user.usecases.factory'
import { LoginDto } from './dto/login.dto'
import { ApiResponse, UserApi } from '@solverse/shared'

@Controller('users')
export class UserController {
  constructor(private readonly userUsecaseFactory: UserUsecaseFactory) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() body: LoginDto,
  ): Promise<ApiResponse<UserApi.Login.Response>> {
    const result = await Effect.runPromise(
      this.userUsecaseFactory.loginUserUsecase.execute({
        userNameOrEmail: body.userNameOrEmail,
        password: body.password,
      }),
    )
    return ApiResponse.ok(result)
  }
}
