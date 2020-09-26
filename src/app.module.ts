import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SuppliersModule } from './suppliers/suppliers.module';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { ShopifyModule } from './shopify/shopify.module';
import { RulesModule } from './rules/rules.module';
import { RulesVersionModule } from './rulesVersion/rulesVersion.module';
import { ConfigModule } from '@nestjs/config';
import { ChronosModule } from "./chronos/chronos.module"
import { StadisticsModule } from "./stadistics/stadistics.module"
import { ProductTraceModule } from "./productTrace/productTrace.module"

//Jobs
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './jobs/TaskSchedules/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    MulterModule.register({
      dest: './../files',
    }),
    MongooseModule.forRoot('mongodb://localhost/brandduBrain'),
    SuppliersModule,
    AuthModule,
    ShopifyModule,
    RulesModule,
    RulesVersionModule,
    ChronosModule,
    StadisticsModule,
    ScheduleModule.forRoot(),
    TasksModule,
    ProductTraceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
