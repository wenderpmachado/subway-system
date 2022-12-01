import { MinLength } from 'class-validator';

export enum OptimalRouteMode {
  SHORTEST,
  LESS_CHANGING,
}

export class FindOptimalRouteParams {
  @MinLength(1)
  origin: string;

  @MinLength(1)
  destination: string;

  mode?: OptimalRouteMode = OptimalRouteMode.SHORTEST;
}

export interface FindOptimalRouteReturn {
  route: string[];
}
