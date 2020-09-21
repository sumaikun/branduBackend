import { Module, HttpModule  } from '@nestjs/common';
import { StadisticsController } from './stadistics.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    })
  ],
  controllers: [StadisticsController],
  providers: []
})
export class StadisticsModule {}
