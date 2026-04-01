import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [CommonModule, UserModule],
  controllers: [],
  providers: [],
})
export class SolverseApiModule { }
