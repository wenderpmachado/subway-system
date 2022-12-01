import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { PrismaService } from './../database/prisma.service';

import { mockedTrainLine } from './train-line.mocked';
import { TrainLineRepository } from './train-line.repository';
import { TrainLineService } from './train-line.service';

describe('TrainLineService', () => {
  let service: TrainLineService;
  let repository: TrainLineRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainLineService, TrainLineRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<TrainLineService>(TrainLineService);
    repository = module.get<TrainLineRepository>(TrainLineRepository);
  });

  describe('create', () => {
    it('should create a new train line', async () => {
      const expectedResult = mockedTrainLine();

      const params: Prisma.TrainLineCreateInput = {
        name: expectedResult.name,
        stations: expectedResult.stations,
      };

      jest.spyOn(repository, 'create').mockResolvedValue(expectedResult);

      expect(await service.create(params)).toBe(expectedResult);
    });
  });
});
