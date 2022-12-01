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

    // FIXME: change to array version
    const lineStations = originLines[0].stations;

    const originIndex = lineStations.findIndex((station) => station === origin);
    const destinationIndex = lineStations.findIndex(
      (station) => station === destination,
    );

    const route =
      originIndex < destinationIndex ? lineStations : lineStations.reverse();

    return { route };
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
    mode,
  }: FindOptimalRouteParams): Promise<FindOptimalRouteReturn | null> {
    return mode === OptimalRouteMode.SHORTEST
      ? this.shortestOptimalRouteStrategy(origin, destination)
      : this.lessChangingOptimalRouteStrategy(origin, destination);
  }
}
