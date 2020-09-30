import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import {  ProductTraceSchema  } from './productTrace.schema';
import { ProductTraceService } from './productTrace.service'
import { ProductTraceController } from './productTrace.controller'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MongooseModule.forFeature([{ name:'ProductTrace', schema: ProductTraceSchema  }])],
  controllers:[ProductTraceController],
  providers: [ProductTraceService],
  exports: [ProductTraceService]
})
export class ProductTraceModule {}