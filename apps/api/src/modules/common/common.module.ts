import { Global, Module } from '@nestjs/common'
import { PersistenceModule } from '@solverse/persistence'

@Global()
@Module({
  imports: [PersistenceModule],
  exports: [PersistenceModule],
})
export class CommonModule {}
