import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from './users.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule,
    MongooseModule.forFeature([{ name:'User', schema:UsersSchema }])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
