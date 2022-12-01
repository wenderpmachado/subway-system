import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, TrainLine } from '@prisma/client';

import { TrainLineRepository } from './train-line.repository';

@Injectable()
export class TrainLineService {
  constructor(private trainLineRepository: TrainLineRepository) {}

  async create(data: Prisma.TrainLineCreateInput): Promise<TrainLine> {
    const trainLine = await this.trainLineRepository.findOne(data.name);

    if (trainLine) throw new ConflictException('Name already in use');

    return this.trainLineRepository.create({ data });
  }
}
