import { NestFactory } from '@nestjs/core';
import { SolverseApiModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(SolverseApiModule);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
