import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';

import { PrismaService } from './../database/prisma.service';
import { TrainLineRepository } from './../train-line/train-line.repository';
import { RouteRepository } from './route.repository';
import { RouteService } from './route.service';

describe('RouteService', () => {
  let routeRepository: RouteRepository;
  let service: RouteService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
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

    routeRepository = moduleRef.get(RouteRepository);
    service = moduleRef.get<RouteService>(RouteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
