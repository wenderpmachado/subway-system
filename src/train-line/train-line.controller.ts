import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Controller, Post, Body } from '@nestjs/common';
import { TrainLine } from '@prisma/client';

import { CreateTrainLine } from './train-line.model';
import { TrainLineService } from './train-line.service';

@ApiTags('train-line')
@Controller('train-line')
export class TrainLineController {
  constructor(private readonly trainLineService: TrainLineService) {}

  @ApiBody({ type: CreateTrainLine, required: true })
  @ApiResponse({
    status: 200,
    description: 'Return the train line created',
  })
  @ApiResponse({
    status: 409,
    description: 'Name already in use',
  })
  @Post('')
  async create(@Body() trainLine: CreateTrainLine): Promise<TrainLine> {
    return this.trainLineService.create(trainLine);
  }
}
