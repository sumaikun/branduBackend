import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ChronosQueueModule } from '../Queues/chronos/chronos.module'
import { ChronosModule } from '../../chronos/chronos.module'


@Module({
  imports:[ChronosQueueModule,ChronosModule],
  providers: [TasksService],
})
export class TasksModule {}