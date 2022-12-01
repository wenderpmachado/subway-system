import { Controller, Param, Get } from '@nestjs/common';

import { FindOptimalRouteParams, FindOptimalRouteReturn } from './route.model';
import { RouteService } from './route.service';

@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Get('')
  async findOptimalRoute(
    @Param() params: FindOptimalRouteParams,
  ): Promise<FindOptimalRouteReturn | null> {
    return this.routeService.findOptimalRoute(params);
  }
}
