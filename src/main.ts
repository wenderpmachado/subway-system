import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { PrismaService } from './database/prisma.service';

async function prismaBootstrap(app: INestApplication) {
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
}

function swaggerBootstrap(app) {
  const config = new DocumentBuilder()
    .setTitle('Subway System API')
    .setDescription('The Subway System api')
    .setVersion('0.1.8')
    .addTag('route')
    .addTag('train-line')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  await prismaBootstrap(app);

  swaggerBootstrap(app);

  await app.listen(3000);
}
bootstrap();
