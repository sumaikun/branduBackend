import { Module } from '@nestjs/common';
import { ChronosController } from './chronos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChronosService } from './chronos.service';
import { ChronosSchema } from './chronos.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule,MongooseModule.forFeature([{ name:'Chronos', schema:ChronosSchema }])],
  controllers: [ChronosController],
  providers: [ChronosService],
  exports: [ChronosService]
})
export class ChronosModule {}
