import { Provider } from "@nestjs/common";
import { IUserRepository } from "@solverse/domain";
import { UserRepositoryImpl } from "./user.repository.impl";

export const REPOSITORIES: Provider[] = [
  { provide: IUserRepository, useClass: UserRepositoryImpl }
]
