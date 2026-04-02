import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { Effect } from 'effect'
import { UserUsecaseFactory } from './usecases/user.usecases.factory'

class LoginDto {
  userNameOrEmail!: string
  password!: string
}

@Controller('users')
export class UserController {
  constructor(private readonly userUsecaseFactory: UserUsecaseFactory) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() body: LoginDto) {
    const program = this.userUsecaseFactory.loginUserUsecase.execute({
      userNameOrEmail: body.userNameOrEmail,
      password: body.password,
    })

    return await Effect.runPromise(program)
  }
}
