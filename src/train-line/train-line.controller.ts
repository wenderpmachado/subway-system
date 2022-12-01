import { Controller, Post, Body } from '@nestjs/common';
import { TrainLine } from '@prisma/client';

import { CreateTrainLine } from './train-line.model';
import { TrainLineService } from './train-line.service';

@Controller('train-line')
export class TrainLineController {
  constructor(private readonly trainLineService: TrainLineService) {}

  @Post('')
  async create(@Body() trainLine: CreateTrainLine): Promise<TrainLine> {
    return this.trainLineService.create(trainLine);
  }
}
