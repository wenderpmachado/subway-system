import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { PrismaService } from './database/prisma.service';

async function prismaBootstrap(app: INestApplication) {
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await prismaBootstrap(app);

  await app.listen(3000);
}
bootstrap();
