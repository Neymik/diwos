import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {

  // somewhere in your initialization file
  const app = await NestFactory.create(
    AppModule
  );

  const logger = app.get(Logger);

  await app.listen(1339);

  logger.log(`Application listening at ${await app.getUrl()}`);

}

bootstrap();
