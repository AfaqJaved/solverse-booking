import { Module } from '@nestjs/common'
import { BusinessController } from './business.controller'
import { CommonModule } from '../common/common.module'
import { BUSINESS_USECASES, BusinessUsecasesFactory } from './usecases/entry'

@Module({
  imports: [CommonModule],
  controllers: [BusinessController],
  providers: [...BUSINESS_USECASES, BusinessUsecasesFactory],
  exports: [BusinessUsecasesFactory],
})
export class BusinessModule {}
