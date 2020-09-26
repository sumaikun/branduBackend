import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as moment from 'moment'
import { ChronosService } from '../../chronos/chronos.service'


@Injectable()
export class TasksService {
  
  constructor(@InjectQueue('chronos') private readonly chronosQueue: Queue,
  private chronosService: ChronosService) {}
  
  private readonly logger = new Logger(TasksService.name);

  @Interval(60000)
  async checkMetrics() {
    this.logger.debug('Called every 60 seconds');
    //await this.chronosQueue.add('checkChronos',{"test":"test"});
    const now = moment()
    console.info("current time: "+now.format('HH:mm'))
    const result = await this.chronosService.findByExecuteHour(now.format('HH:mm'))
    if(result.length > 0){
      await this.chronosQueue.add('checkChronos',result[0]);
    }
  }

}