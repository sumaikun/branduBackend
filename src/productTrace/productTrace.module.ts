import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import {  ProductTraceSchema  } from './productTrace.schema';
import { ProductTraceService } from './productTrace.service'
import { ProductTraceController } from './productTrace.controller'


@Module({
  imports: [
    MongooseModule.forFeature([{ name:'ProductTrace', schema: ProductTraceSchema  }])],
  controllers:[ProductTraceController],
  providers: [ProductTraceService],
  exports: [ProductTraceService]
})
export class ProductTraceModule {}