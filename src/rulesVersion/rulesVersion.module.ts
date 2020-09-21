import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import {  RulesVersionSchema  } from './rulesVersion.schema';
import { VersionService } from './rulesVersion.service'


@Module({
  imports: [
    MongooseModule.forFeature([{ name:'RuleVersion', schema: RulesVersionSchema  }])],
  providers: [VersionService],
  exports: [VersionService]
})
export class RulesVersionModule {}