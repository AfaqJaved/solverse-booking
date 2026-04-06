import { Module } from '@nestjs/common'
import { CommonModule } from '../common/common.module'
import { SERVICE_USECASES, ServiceUsecasesFactory } from './usecases/entry'
import { ServiceController } from './service.controller'

@Module({
  imports: [CommonModule],
  controllers: [ServiceController],
  providers: [...SERVICE_USECASES, ServiceUsecasesFactory],
  exports: [ServiceUsecasesFactory],
})
export class ServiceModule {}
