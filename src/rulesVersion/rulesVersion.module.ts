import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { RulesSchema } from './rulesVersion.schema';
import { RulesService } from './rulesVersion.service'


@Module({
  imports: [
    MongooseModule.forFeature([{ name:'RuleVersion', schema:RulesSchema }])],
  providers: [RulesService],
  exports: [RulesService]
})
export class RulesVersionModule {}