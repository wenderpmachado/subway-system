import { Module } from '@nestjs/common';

import { TrainLineRepository } from './../train-line/train-line.repository';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';

@Module({
  controllers: [RouteController],
  providers: [RouteService, TrainLineRepository],
})
export class RouteModule {}
