import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { CommonModule } from '../common/common.module'
import { USER_USECASES } from './usecases/entry'
import { UserUsecaseFactory } from './usecases/user.usecases.factory'

@Module({
  imports: [CommonModule],
  controllers: [UserController],
  providers: [...USER_USECASES, UserUsecaseFactory],
  exports: [UserUsecaseFactory],
})
export class UserModule {}
