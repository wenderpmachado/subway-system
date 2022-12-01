import { Module } from '@nestjs/common';

import { PrismaModule } from './../database/prisma.module';
import { TrainLineRepository } from './../train-line/train-line.repository';
import { RouteController } from './route.controller';
import { RouteRepository } from './route.repository';
import { RouteService } from './route.service';

@Module({
  imports: [PrismaModule],
  controllers: [RouteController],
  providers: [RouteService, RouteRepository, TrainLineRepository],
})
export class RouteModule {}
