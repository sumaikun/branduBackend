import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { BackupSchema } from './backups.schema';
import { ProductBackupService } from './backups.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name:'ProductBackup', schema: BackupSchema  }])],
  providers: [ProductBackupService],
  exports: [ProductBackupService]
})
export class ProductBackupModule {}