import { Module } from '@nestjs/common'
import { UserModule } from './modules/user/user.module'
import { CommonModule } from './modules/common/common.module'
import { SecurityModule } from './modules/security/security.module'

@Module({
  imports: [CommonModule, SecurityModule, UserModule],
  controllers: [],
  providers: [],
})
export class SolverseApiModule {}
