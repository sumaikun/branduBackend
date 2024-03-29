import { Module } from '@nestjs/common';
import { SuppliersController } from './suppliers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SuppliersService } from './suppliers.service';
import { SuppliersSchema } from './suppliers.schema';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module'

@Module({
  imports: [AuthModule,UsersModule,
    MongooseModule.forFeature([{ name:'Supplier', schema:SuppliersSchema }])],
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [ SuppliersService ]
})
export class SuppliersModule {}
