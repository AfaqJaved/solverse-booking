import { Module } from "@nestjs/common";
import { PERSITENCE_MAPPPERS } from "./mappers/entry";
import { PersistenceMapperFactory } from "./mappers/persistence.mapper.factory";
import { REPOSITORIES } from "./repositories/entry";
import { RepositoryFactory } from "./repositories/repository.factory";

@Module({
  providers: [...PERSITENCE_MAPPPERS, PersistenceMapperFactory, ...REPOSITORIES, RepositoryFactory],
  exports: [RepositoryFactory, PersistenceMapperFactory]
})
export class PersistenceModule {

}
