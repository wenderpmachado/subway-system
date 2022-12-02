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

  private getPartialRoute(
    stations: string[],
    origin: string,
    destination: string,
  ) {
    const originIndex = stations.findIndex((station) => station === origin);

    const destinationIndex = stations.findIndex(
      (station) => station === destination,
    );

    if (destinationIndex === -1) return -1;

    const diff = originIndex - destinationIndex;

    return diff < 0
      ? stations.slice(originIndex, destinationIndex + 1)
      : stations.slice(destinationIndex, originIndex + 1);
  }

  private async routeMapper(
    originLine: TrainLine,
    destination: string,
    destinationLines: TrainLine[],
  ) {
    const { stations: originStations, id } = originLine;
    const [origin] = originStations;

    let route: string[] = [origin];
    let partialRoute: string[] | -1;

    partialRoute = this.getPartialRoute(originStations, origin, destination);

    if (partialRoute !== -1) {
      route = partialRoute;
    } else {
      for (const nextOrigin of originStations.slice(1)) {
        for (const { stations: destinationStations } of destinationLines) {
          partialRoute = this.getPartialRoute(
            destinationStations,
            destination,
            nextOrigin,
          );

          if (partialRoute !== -1) {
            route.push(...partialRoute);

            break;
          }

          const hasOriginStationsDestination =
            originStations.includes(destination);

          if (!hasOriginStationsDestination) {
            route.push(nextOrigin);
            const intermediateLines =
              await this.trainLineRepository.findByStation(nextOrigin, id);

            if (intermediateLines) {
              for (const intermediateLine of intermediateLines) {
                const { stations: intermediateStations } = intermediateLine;
                const isIntermediateIncluded = destinationStations.some(
                  (destinationStation) =>
                    intermediateStations.includes(destinationStation),
                );

                if (isIntermediateIncluded) {
                  const intermediateRoute = await this.routeMapper(
                    intermediateLine,
                    destination,
                    destinationLines,
                  );

                  route.push(...intermediateRoute);

                  break;
                }
              }
            }
          }
        }

        if (route.at(-1) === destination) break;
      }
    }

    return [...new Set(route)];
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

    const possibleRoutes: [string[]] = [] as unknown as [string[]];

    for (const originLine of originLines) {
      const route = await this.routeMapper(
        originLine,
        destination,
        destinationLines,
      );

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
