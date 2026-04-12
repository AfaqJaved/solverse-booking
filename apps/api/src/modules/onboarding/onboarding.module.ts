import { Module } from '@nestjs/common'
import { OnboardingController } from './onboarding.controller'
import { OnboardUsecaseImpl } from './usecases/onboard.usecase.impl'

@Module({
  controllers: [OnboardingController],
  providers: [OnboardUsecaseImpl],
})
export class OnboardingModule {}
