import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

import { PrismaService } from './../database/prisma.service';

import { TrainLineRepository } from './train-line.repository';
import { TrainLineController } from './train-line.controller';
import { mockedTrainLine } from './train-line.mocked';
import { TrainLineService } from './train-line.service';
import { ICreateTrainLine } from './train-line.interface';

describe('TrainLineController', () => {
  let controller: TrainLineController;
  let service: TrainLineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainLineController],
      providers: [TrainLineService, TrainLineRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    controller = module.get<TrainLineController>(TrainLineController);
    service = module.get<TrainLineService>(TrainLineService);
  });

  describe('create', () => {
    it('should create a new train line', async () => {
      const expectedResult = mockedTrainLine();

      const body: ICreateTrainLine = {
        name: expectedResult.name,
        stations: expectedResult.stations,
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      expect(await controller.create(body)).toBe(expectedResult);
    });
  });
});
