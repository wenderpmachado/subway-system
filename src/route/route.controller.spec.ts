import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

import { RouteController } from './route.controller';
import { PrismaService } from './../database/prisma.service';
import { TrainLineRepository } from './../train-line/train-line.repository';
import { RouteRepository } from './route.repository';
import { RouteService } from './route.service';
import { mockDeep } from 'jest-mock-extended';

describe('RouteController', () => {
  let controller: RouteController;
  let service: RouteService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [RouteController],
      providers: [
        RouteService,
        RouteRepository,
        TrainLineRepository,
        PrismaService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    controller = moduleRef.get<RouteController>(RouteController);
    service = moduleRef.get<RouteService>(RouteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
