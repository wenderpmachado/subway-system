import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, TrainLine } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { mockedTrainLine } from '../train-line/train-line.mocked';
import { TrainLineRepository } from './../train-line/train-line.repository';
import { PrismaService } from '../database/prisma.service';
import {
  FindOptimalRouteParams,
  FindOptimalRouteReturn,
  OptimalRouteMode,
} from './route.model';
import { RouteRepository } from './route.repository';

describe('RouteRepository', () => {
  let routeRepository: RouteRepository;
  let trainLineRepository: TrainLineRepository;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [RouteRepository, TrainLineRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    routeRepository = moduleRef.get(RouteRepository);
    trainLineRepository = moduleRef.get(TrainLineRepository);
    prismaService = moduleRef.get(PrismaService);
  });

  describe('findOptimalRoute', () => {
    it('when origin dos not exist, return error', async () => {
      const params: FindOptimalRouteParams = {
        origin: 'E',
        destination: 'B',
        mode: OptimalRouteMode.SHORTEST,
      };

      const trainLinesOrigin: TrainLine[] = [];
      const trainLinesDestination: TrainLine[] = [mockedTrainLine()];

      jest
        .spyOn(trainLineRepository, 'findByStation')
        .mockResolvedValueOnce(trainLinesOrigin)
        .mockResolvedValueOnce(trainLinesDestination);

      await expect(
        routeRepository.findOptimalRoute(params),
      ).rejects.toThrowError(NotFoundException);
    });

    it('when destination dos not exist, return error', async () => {
      const params: FindOptimalRouteParams = {
        origin: 'B',
        destination: 'E',
        mode: OptimalRouteMode.SHORTEST,
      };

      const trainLinesOrigin: TrainLine[] = [mockedTrainLine()];
      const trainLinesDestination: TrainLine[] = [];

      jest
        .spyOn(trainLineRepository, 'findByStation')
        .mockResolvedValueOnce(trainLinesOrigin)
        .mockResolvedValueOnce(trainLinesDestination);

      await expect(
        routeRepository.findOptimalRoute(params),
      ).rejects.toThrowError(NotFoundException);
    });

    it('when a unique line has an origin and destination, then return station list from origin to destination', async () => {
      const params: FindOptimalRouteParams = {
        origin: 'A',
        destination: 'D',
        mode: OptimalRouteMode.SHORTEST,
      };

      const trainLines: TrainLine[] = [mockedTrainLine(['A', 'B', 'C', 'D'])];

      jest
        .spyOn(trainLineRepository, 'findByStation')
        .mockResolvedValue(trainLines);

      const expectedResult: FindOptimalRouteReturn = {
        route: trainLines[0].stations,
      };

      expect(await routeRepository.findOptimalRoute(params)).toMatchObject(
        expectedResult,
      );
    });

    it('when a unique line has an origin and destination, but different way, then return station list from origin to destination reversed', async () => {
      const params: FindOptimalRouteParams = {
        origin: 'A',
        destination: 'D',
        mode: OptimalRouteMode.SHORTEST,
      };

      const trainLines: TrainLine[] = [mockedTrainLine(['D', 'C', 'B', 'A'])];

      jest
        .spyOn(trainLineRepository, 'findByStation')
        .mockResolvedValue(trainLines);

      const expectedResult: FindOptimalRouteReturn = {
        route: trainLines[0].stations.reverse(),
      };

      expect(await routeRepository.findOptimalRoute(params)).toMatchObject(
        expectedResult,
      );
    });

    it('when more than one line has an origin and destination, and the first is the optimal route, then return it', async () => {
      const params: FindOptimalRouteParams = {
        origin: 'A',
        destination: 'D',
        mode: OptimalRouteMode.SHORTEST,
      };

      const trainLines: TrainLine[] = [
        mockedTrainLine(['A', 'D']),
        mockedTrainLine(['A', 'B', 'C', 'D']),
      ];

      jest
        .spyOn(trainLineRepository, 'findByStation')
        .mockResolvedValue(trainLines);

      const expectedResult: FindOptimalRouteReturn = {
        route: trainLines[0].stations,
      };

      expect(await routeRepository.findOptimalRoute(params)).toMatchObject(
        expectedResult,
      );
    });

    it('when more than one line has an origin and destination, and the second is the optimal route, then return it', async () => {
      const params: FindOptimalRouteParams = {
        origin: 'A',
        destination: 'D',
        mode: OptimalRouteMode.SHORTEST,
      };

      const trainLines: TrainLine[] = [
        mockedTrainLine(['A', 'B', 'C', 'D']),
        mockedTrainLine(['A', 'D']),
      ];

      jest
        .spyOn(trainLineRepository, 'findByStation')
        .mockResolvedValue(trainLines);

      const expectedResult: FindOptimalRouteReturn = {
        route: trainLines[1].stations,
      };

      expect(await routeRepository.findOptimalRoute(params)).toMatchObject(
        expectedResult,
      );
    });

    // it('when an origin is in one line and the destination in other, then return the junction of the two', async () => {
    //   const params: FindOptimalRouteParams = {
    //     origin: 'A',
    //     destination: 'F',
    //     mode: OptimalRouteMode.SHORTEST,
    //   };

    //   const trainLines: TrainLine[] = [
    //     mockedTrainLine(['A', 'B', 'C']),
    //     mockedTrainLine(['B', 'F']),
    //   ];

    //   jest
    //     .spyOn(trainLineRepository, 'findByStation')
    //     .mockResolvedValueOnce([trainLines[0]])
    //     .mockResolvedValueOnce([trainLines[1]]);

    //   const optimalRouteExpected = ['A', 'B', 'F'];

    //   const expectedResult: FindOptimalRouteReturn = {
    //     route: optimalRouteExpected,
    //   };

    //   expect(await routeRepository.findOptimalRoute(params)).toMatchObject(
    //     expectedResult,
    //   );
    // });

    // it('when an origin is in one line and the destination in other, but there is one in the middle, then return the junction of the two', async () => {
    //   const params: FindOptimalRouteParams = {
    //     origin: 'A',
    //     destination: 'F',
    //     mode: OptimalRouteMode.SHORTEST,
    //   };

    //   const trainLines: TrainLine[] = [
    //     mockedTrainLine(['A', 'B', 'C']),
    //     mockedTrainLine(['B', 'D', 'E']),
    //     mockedTrainLine(['D', 'F']),
    //   ];

    //   jest
    //     .spyOn(trainLineRepository, 'findByStation')
    //     .mockResolvedValueOnce([trainLines[0]])
    //     .mockResolvedValueOnce([trainLines[2]])
    //     .mockResolvedValueOnce([trainLines[1]]);

    //   const optimalRouteExpected = ['A', 'B', 'D', 'F'];

    //   const expectedResult: FindOptimalRouteReturn = {
    //     route: optimalRouteExpected,
    //   };

    //   expect(await routeRepository.findOptimalRoute(params)).toMatchObject(
    //     expectedResult,
    //   );
    // });
  });
});
