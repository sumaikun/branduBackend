import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ChronosProcessor } from './chronos.processor';
import { ShopifyModule } from '../../../shopify/shopify.module';
import { RulesModule } from '../../../rules/rules.module';
import { SuppliersModule } from '../../../suppliers/suppliers.module';
//import { ConfigModule, ConfigService } from '@nestjs/config';


const QueueModule = BullModule.registerQueue({ 
    name: 'chronos',
    redis: {
      host: process.env.REDIS_HOST,
      port: 6379,
    },
});

@Module({
  imports: [QueueModule,
    ShopifyModule,
    RulesModule,
    SuppliersModule],
  providers: [ChronosProcessor],
  exports:[QueueModule]
})
export class ChronosQueueModule {

  constructor()
  {
    console.log("REDIS HOST",process.env.REDIS_HOST)
  }
  
}