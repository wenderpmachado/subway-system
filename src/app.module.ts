import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrainLineModule } from './train-line/train-line.module';

@Module({
  imports: [TrainLineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
