import { faker } from '@faker-js/faker';
import { TrainLine } from '@prisma/client';

export const mockedTrainLine = (
  stations: string[] = Array.from({ length: 1 }, faker.name.lastName),
): TrainLine => ({
  id: faker.datatype.number(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
  name: faker.name.lastName(),
  stations,
});
