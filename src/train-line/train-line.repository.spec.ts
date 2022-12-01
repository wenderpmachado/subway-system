import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { PrismaService } from './../database/prisma.service';
import { mockedTrainLine } from './train-line.mocked';
import { TrainLineRepository } from './train-line.repository';

describe('TrainLineRepositoryService', () => {
  let repository: TrainLineRepository;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [TrainLineRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    repository = moduleRef.get(TrainLineRepository);
    prismaService = moduleRef.get(PrismaService);
  });

  describe('create', () => {
    it('should create a new train line', async () => {
      // Arrange
      const expectedResult = mockedTrainLine();
      prismaService.trainLine.create.mockResolvedValue(expectedResult);

      // Act
      const create = () =>
        repository.create({
          data: {
            name: expectedResult.name,
            stations: expectedResult.stations,
          },
        });

      // Assert
      await expect(create()).resolves.toBe(expectedResult);
    });
  });
});
