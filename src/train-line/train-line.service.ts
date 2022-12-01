import { Injectable } from '@nestjs/common';
import { Prisma, TrainLine } from '@prisma/client';

import { TrainLineRepository } from './train-line.repository';

@Injectable()
export class TrainLineService {
  constructor(private trainLineRepository: TrainLineRepository) {}

  async create(data: Prisma.TrainLineCreateInput): Promise<TrainLine> {
    return this.trainLineRepository.create({ data });
  }
}
