import { Injectable } from '@nestjs/common';

import { FindOptimalRouteParams, FindOptimalRouteReturn } from './route.model';
import { RouteRepository } from './route.repository';

@Injectable()
export class RouteService {
  constructor(private readonly routeRepository: RouteRepository) {}

  async findOptimalRoute(
    params: FindOptimalRouteParams,
  ): Promise<FindOptimalRouteReturn | null> {
    return this.routeRepository.findOptimalRoute(params);
  }
}
