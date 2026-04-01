import { IUserRepository, UserRepository } from '@solverse/domain';
import { Inject, Injectable } from '@nestjs/common';


@Injectable()
export class RepositoryFactory {
  @Inject(IUserRepository) public readonly userRepository!: UserRepository;

}
