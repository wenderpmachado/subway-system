import { TrainLine } from '@prisma/client';
import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { isEmpty } from 'lodash';

import { TrainLineRepository } from './../train-line/train-line.repository';
import {
  FindOptimalRouteParams,
  FindOptimalRouteReturn,
  OptimalRouteMode,
} from './route.model';

@Injectable()
export class RouteRepository {
  constructor(private trainLineRepository: TrainLineRepository) {}

  private routeMapper(
    originStations: string[],
    destination: string,
    destinationLines: TrainLine[],
  ) {
    const [origin] = originStations;
    let route = [origin];

    const originIndex = originStations.findIndex(
      (station) => station === origin,
    );

    const destinationIndex = originStations.findIndex(
      (station) => station === destination,
    );

    if (destinationIndex !== -1) {
      const diff = originIndex - destinationIndex;

      route =
        diff < 0
          ? originStations.slice(originIndex, destinationIndex + 1)
          : originStations.slice(destinationIndex, originIndex + 1);
    } else {
      // TODO: Different cases
      // const nextOriginStations = originStations.slice(1);
      // const [nextOrigin] = nextOriginStations;
      // for (const { stations: destinationStations } of destinationLines) {
      //   const newOriginIndex = destinationStations.findIndex(
      //     (station) => station === nextOrigin,
      //   );
      //   if (newOriginIndex !== -1) {
      //     // TODO: extract
      //     route =
      //       diff < 0
      //         ? originStations.slice(originIndex, destinationIndex + 1)
      //         : originStations.slice(destinationIndex, originIndex + 1);
      //   }
      //   route.push(
      //     ...this.routeMapper(
      //       nextOriginStations,
      //       destination,
      //       destinationLines,
      //     ),
      //   );
      // }
      // route.push(
      //   ...this.routeMapper(
      //     nextOriginStations,
      //     destination,
      //     destinationLines,
      //     false,
      //   ),
      // );
    }

    return route;
  }

  private async shortestOptimalRouteStrategy(
    origin: string,
    destination: string,
  ): Promise<FindOptimalRouteReturn | null> {
    const originLines = await this.trainLineRepository.findByStation(origin);

    if (isEmpty(originLines)) throw new NotFoundException('Origin not found');

    const destinationLines = await this.trainLineRepository.findByStation(
      destination,
    );

    if (isEmpty(destinationLines))
      throw new NotFoundException('Destination not found');

    // const lines = unionBy(originLines, destinationLines, 'id');
    const possibleRoutes: [string[]] = [] as unknown as [string[]];

    for (const { stations } of originLines) {
      const route = this.routeMapper(stations, destination, destinationLines);

      possibleRoutes.push(route);
    }

    const [optimalRoute] = possibleRoutes.sort((a, b) => a.length - b.length);

    return { route: optimalRoute };
  }

  private async lessChangingOptimalRouteStrategy(
    origin: string,
    destination: string,
  ): Promise<FindOptimalRouteReturn | null> {
    throw new NotImplementedException();
  }

  async findOptimalRoute({
    origin,
    destination,
    mode = OptimalRouteMode.SHORTEST,
  }: FindOptimalRouteParams): Promise<FindOptimalRouteReturn | null> {
    return mode === OptimalRouteMode.SHORTEST
      ? this.shortestOptimalRouteStrategy(origin, destination)
      : this.lessChangingOptimalRouteStrategy(origin, destination);
  }
}
