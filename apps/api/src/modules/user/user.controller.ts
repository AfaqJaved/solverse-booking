import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Effect } from 'effect'
import { UserUsecaseFactory } from './usecases/user.usecases.factory'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { ChangeEmailDto } from './dto/change-email.dto'
import { SuspendUserDto } from './dto/suspend-user.dto'
import { ApiResponse, UserApi } from '@solverse/shared'
import { LoginDoc } from './docs/login.doc'
import { RegisterDoc } from './docs/register.doc'
import { VerifyEmailDoc } from './docs/verify-email.doc'
import { GetUserDoc } from './docs/get-user.doc'
import { UpdateProfileDoc } from './docs/update-profile.doc'
import { ChangeEmailDoc } from './docs/change-email.doc'
import { DeactivateUserDoc } from './docs/deactivate-user.doc'
import { ReactivateUserDoc } from './docs/reactivate-user.doc'
import { SuspendUserDoc } from './docs/suspend-user.doc'
import { UserMapper } from './mapper/user.mapper'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userUsecaseFactory: UserUsecaseFactory) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LoginDoc()
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

  @Post('register')
  @RegisterDoc()
  public async register(
    @Body() body: RegisterDto,
  ): Promise<ApiResponse<UserApi.Register.Response>> {
    const result = await Effect.runPromise(
      this.userUsecaseFactory.registerUserUsecase.execute({
        username: body.username,
        password: body.password,
        name: body.name,
        email: body.email,
        role: body.role,
        timezone: body.timezone,
        phone: body.phone,
      }),
    )
    return ApiResponse.created(result)
  }

  @Post(':userId/verify-email')
  @HttpCode(HttpStatus.OK)
  @VerifyEmailDoc()
  public async verifyEmail(
    @Param('userId') userId: string,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.userUsecaseFactory.verifyEmailUsecase.execute({ userId }),
    )
    return ApiResponse.ok(null)
  }

  @Get(':userId')
  @GetUserDoc()
  public async getUser(
    @Param('userId') userId: string,
  ): Promise<ApiResponse<UserApi.GetUser.Response>> {
    const user = await Effect.runPromise(
      this.userUsecaseFactory.getUserUsecase.execute({ userId }),
    )
    return ApiResponse.ok(UserMapper.userAggregateToResponse(user))
  }

  @Patch(':userId/profile')
  @HttpCode(HttpStatus.OK)
  @UpdateProfileDoc()
  public async updateProfile(
    @Param('userId') userId: string,
    @Body() body: UpdateProfileDto,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.userUsecaseFactory.updateProfileUsecase.execute({
        userId,
        timezone: body.timezone,
        phone: body.phone,
        notificationPreferences: body.notificationPreferences,
      }),
    )
    return ApiResponse.ok(null)
  }

  @Patch(':userId/email')
  @HttpCode(HttpStatus.OK)
  @ChangeEmailDoc()
  public async changeEmail(
    @Param('userId') userId: string,
    @Body() body: ChangeEmailDto,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.userUsecaseFactory.changeEmailUsecase.execute({
        userId,
        newEmail: body.newEmail,
      }),
    )
    return ApiResponse.ok(null)
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.OK)
  @DeactivateUserDoc()
  public async deactivateUser(
    @Param('userId') userId: string,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.userUsecaseFactory.deactivateUserUsecase.execute({ userId }),
    )
    return ApiResponse.ok(null)
  }

  @Patch(':userId/reactivate')
  @HttpCode(HttpStatus.OK)
  @ReactivateUserDoc()
  public async reactivateUser(
    @Param('userId') userId: string,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.userUsecaseFactory.reactivateUserUsecase.execute({ userId }),
    )
    return ApiResponse.ok(null)
  }

  @Patch(':userId/suspend')
  @HttpCode(HttpStatus.OK)
  @SuspendUserDoc()
  public async suspendUser(
    @Param('userId') userId: string,
    @Body() body: SuspendUserDto,
  ): Promise<ApiResponse<null>> {
    await Effect.runPromise(
      this.userUsecaseFactory.suspendUserUsecase.execute({
        userId,
        reason: body.reason,
      }),
    )
    return ApiResponse.ok(null)
  }
}
