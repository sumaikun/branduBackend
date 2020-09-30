import { Module } from '@nestjs/common';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RulesSchema } from './rules.schema';
import { AuthModule } from '../auth/auth.module';
import { RulesVersionModule } from '../rulesVersion/rulesVersion.module'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [AuthModule,
    UsersModule,
    RulesVersionModule,
    MongooseModule.forFeature([{ name:'Rule', schema:RulesSchema }])],
  controllers: [RulesController],
  providers: [RulesService],
  exports: [RulesService]
})
export class RulesModule {}
