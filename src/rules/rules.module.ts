import { Module } from '@nestjs/common';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RulesSchema } from './rules.schema';
import { AuthModule } from '../auth/auth.module';
import { RulesVersionModule } from '../rulesVersion/rulesVersion.module'
import { UsersModule } from '../users/users.module'
import { ChronosModule } from '../chronos/chronos.module'

@Module({
  imports: [AuthModule,
    UsersModule,
    RulesVersionModule,
    ChronosModule,
    MongooseModule.forFeature([{ name:'Rule', schema:RulesSchema }])],
  controllers: [RulesController],
  providers: [RulesService],
  exports: [RulesService]
})
export class RulesModule {}
