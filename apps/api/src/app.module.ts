import { Module } from '@nestjs/common'
import { UserModule } from './modules/user/user.module'
import { BusinessModule } from './modules/business/business.module'
import { CommonModule } from './modules/common/common.module'
import { SecurityModule } from './modules/security/security.module'
import { ServiceModule } from './modules/service/service.module'

@Module({
  imports: [
    CommonModule,
    SecurityModule,
    UserModule,
    BusinessModule,
    ServiceModule,
  ],
  controllers: [],
  providers: [],
})
export class SolverseApiModule {}
