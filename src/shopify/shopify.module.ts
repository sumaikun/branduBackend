import { Module, HttpModule  } from '@nestjs/common';
import { ShopifyController } from './shopify.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    })
  ],
  controllers: [ShopifyController],
  providers: []
})
export class ShopifyModule {}
