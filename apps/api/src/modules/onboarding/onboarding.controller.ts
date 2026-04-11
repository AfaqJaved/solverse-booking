import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Effect } from 'effect'
import { ApiResponse, OnboardingApi, APICONSTANTS } from '@solverse/shared'
import { OnboardUsecaseImpl } from './usecases/onboard.usecase.impl'
import { OnboardingDto } from './dto/onboarding.dto'
import { RegisterOnboardingDoc } from './docs/onboarding.doc'

@ApiTags('Onboarding')
@Controller(APICONSTANTS.BASE_PATHS.ONBOARDING)
export class OnboardingController {
  constructor(private readonly onboardUsecase: OnboardUsecaseImpl) {}

  @Post(APICONSTANTS.ROUTES.ONBOARDING.REGISTER)
  @HttpCode(HttpStatus.CREATED)
  @RegisterOnboardingDoc()
  public async register(
    @Body() body: OnboardingDto,
  ): Promise<ApiResponse<OnboardingApi.Register.Response>> {
    const result = await Effect.runPromise(
      this.onboardUsecase.execute(body),
    )
    return ApiResponse.created(result)
  }
}
