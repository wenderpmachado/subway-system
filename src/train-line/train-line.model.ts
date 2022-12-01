import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, MinLength } from 'class-validator';

// More validations in https://github.com/typestack/class-validator#validation-decorators

export class CreateTrainLine {
  @ApiProperty()
  @MinLength(1)
  name: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  stations: string[];
}
