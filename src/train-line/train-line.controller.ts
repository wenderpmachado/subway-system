import { Controller, Post, Body } from '@nestjs/common';
import { TrainLine } from '@prisma/client';

import { ICreateTrainLine } from './train-line.interface';
import { TrainLineService } from './train-line.service';

@Controller('train-line')
export class TrainLineController {
  constructor(private readonly trainLineService: TrainLineService) {}

  @Post('')
  async create(@Body() trainLine: ICreateTrainLine): Promise<TrainLine> {
    return this.trainLineService.create(trainLine);
  }
}
