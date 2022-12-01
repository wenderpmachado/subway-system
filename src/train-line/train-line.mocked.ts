import { TrainLine } from '@prisma/client';

export const mockedTrainLine = (): TrainLine => ({
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: '1',
  stations: ['Canal', 'Houston', 'Christopher', '14th'],
});
