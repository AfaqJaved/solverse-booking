import { Controller, Get, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { RepositoryFactory } from "@solverse/persistence";
import { Effect, Option } from "effect";
import { Schema } from "effect";
import { UserId } from "@solverse/domain";

@Controller('users')
export class UserController {
  constructor(private readonly repositoryFactory: RepositoryFactory) { }

  @Get(':id')
  public async getUser() {
    const userId = Schema.decodeUnknownSync(UserId)("36d2406c-968b-4812-884e-2acbe7db65bc");

    const result = await Effect.runPromise(
      this.repositoryFactory.userRepository.findById(userId).pipe(
        Effect.mapError(() => new InternalServerErrorException('Database error'))
      )
    );

    if (Option.isNone(result)) {
      throw new NotFoundException(`User  not found`);
    }

    return result.value;
  }
}
