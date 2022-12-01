import { Module } from '@nestjs/common';

import { PrismaModule } from './../database/prisma.module';

import { TrainLineController } from './train-line.controller';
import { TrainLineRepository } from './train-line.repository';
import { TrainLineService } from './train-line.service';

@Module({
  imports: [PrismaModule],
  controllers: [TrainLineController],
  providers: [TrainLineRepository, TrainLineService],
})
export class TrainLineModule {}
