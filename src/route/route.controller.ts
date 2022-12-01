import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Controller, Query, Get } from '@nestjs/common';

import {
  FindOptimalRouteParams,
  FindOptimalRouteReturn,
  OptimalRouteMode,
} from './route.model';
import { RouteService } from './route.service';

@ApiTags('route')
@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @ApiQuery({ name: 'origin', required: false })
  @ApiQuery({ name: 'destination', required: false })
  @ApiQuery({ name: 'mode', enum: OptimalRouteMode })
  @ApiResponse({
    status: 200,
    type: FindOptimalRouteReturn,
    description: 'Return the optimal route',
  })
  @ApiResponse({
    status: 404,
    description: 'Origin or destination not found',
  })
  @Get('')
  async findOptimalRoute(
    @Query() params: FindOptimalRouteParams,
  ): Promise<FindOptimalRouteReturn | null> {
    return this.routeService.findOptimalRoute(params);
  }
}
