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
import { ConfigModule } from '@nestjs/config';




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
    RulesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
