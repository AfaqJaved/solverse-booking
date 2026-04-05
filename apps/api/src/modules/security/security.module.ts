import {
  Global,
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common'
import { SecurityContext } from './context/security.context'
import { JwtMiddleware } from './middleware/jwt.middleware'

@Global()
@Module({
  providers: [SecurityContext],
  exports: [SecurityContext],
})
export class SecurityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
