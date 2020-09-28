import { Module, HttpModule, forwardRef  } from '@nestjs/common';
import { ShopifyController } from './shopify.controller';
import { AuthModule } from '../auth/auth.module';
import { ShopifyService } from './shopify.service';
import { ProductTraceModule } from '../productTrace/productTrace.module'
import { ChronosQueueModule } from '../jobs/Queues/chronos/chronos.module'
@Module({
  imports: [AuthModule,
    ChronosQueueModule,
    ProductTraceModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    })
  ],
  controllers: [ShopifyController],
  providers: [ ShopifyService ],
  exports:[ ShopifyService ]
})
export class ShopifyModule {}
