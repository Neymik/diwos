import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { SocketAdapter } from './config/socketAdapter';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { WsAdapter } from '@nestjs/platform-ws';
import { join } from 'path';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {

  const app = 
    await NestFactory.create<NestFastifyApplication>(
      AppModule, new FastifyAdapter()
    );
    
  // CORS
  // const options = {
  //   "origin": true,
  //   "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  //   "preflightContinue": false,
  //   "optionsSuccessStatus": 204,
  //   "credentials":true
  // };
  // app.enableCors(options);

  // Static
  app.register(require('fastify-static'), {
    root: join(__dirname, '..', 'public')
  });

  app.use(morgan('dev'));
  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(13372);

  const logger = app.get(Logger);
  logger.log(`Application listening at ${await app.getUrl()}`);

}

bootstrap();
