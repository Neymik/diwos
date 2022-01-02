import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';

async function bootstrap() {

  const app = await NestFactory.create(
    AppModule
  );

  const logger = app.get(Logger);

  app.use(morgan('dev'));

  await app.listen(1339);

  logger.log(`Application listening at ${await app.getUrl()}`);

}

bootstrap();
