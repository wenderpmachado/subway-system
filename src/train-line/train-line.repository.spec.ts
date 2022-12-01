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

  describe('findOne', () => {
    it('should find the first (and unique) train line with a name', async () => {
      // Arrange
      const expectedResult = mockedTrainLine();
      prismaService.trainLine.findFirst.mockResolvedValue(expectedResult);

      // Act
      const findOne = () => repository.findOne(expectedResult.name);

      // Assert
      await expect(findOne()).resolves.toBe(expectedResult);
    });

    it('should not find a train line if passed a nmae that does not exist in the database', async () => {
      // Arrange
      const expectedResult = null;
      prismaService.trainLine.findFirst.mockResolvedValue(null);

      // Act
      const findOne = () => repository.findOne('Random name');

      // Assert
      await expect(findOne()).resolves.toBe(expectedResult);
    });
  });
});
