import { Module, HttpModule  } from '@nestjs/common';
import { StadisticsController } from './stadistics.controller';
import { AuthModule } from '../auth/auth.module';
import { RulesModule } from '../rules/rules.module';
import { SuppliersModule } from '../suppliers/suppliers.module';
import { ProductBackupModule } from '../backups/backups.module';
import { ProductTraceModule } from '../productTrace/productTrace.module';

@Module({
  imports: [AuthModule,
    RulesModule,
    SuppliersModule,
    ProductBackupModule,
    ProductTraceModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    })
  ],
  controllers: [StadisticsController],
  providers: []
})
export class StadisticsModule {}
