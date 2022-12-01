import { IsArray, ArrayNotEmpty, MinLength } from 'class-validator';

// More validations in https://github.com/typestack/class-validator#validation-decorators

export class CreateTrainLine {
  @MinLength(1)
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  stations: string[];
}
