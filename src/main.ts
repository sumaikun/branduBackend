import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/all-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { properties } from './properties'

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

  app.enableCors();

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.useGlobalPipes(new ValidationPipe());

  properties.setDataToPersist({})

  process.env.globalShopifyProductsByService = JSON.stringify({}) 

  await app.listen(3000);

}
bootstrap();
