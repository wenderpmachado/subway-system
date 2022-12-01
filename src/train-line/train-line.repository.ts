import { Injectable } from '@nestjs/common';
import { Prisma, TrainLine } from '@prisma/client';

import { PrismaService } from './../database/prisma.service';

@Injectable()
export class TrainLineRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: {
    data: Prisma.TrainLineCreateInput;
  }): Promise<TrainLine> {
    const { data } = params;

    return this.prisma.trainLine.create({ data });
  }
}
