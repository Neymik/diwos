import { Inject, Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as RedisStore from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';
import { RedisClient } from 'redis';

import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { AuthModule } from './auth';
import { REDIS, RedisModule } from 'redisConfig';

import { GameObjModule } from 'src/modules/gameObj/gameObj.module';
import { UserModule } from 'src/modules/user/user.module';
import { WorldModule } from 'src/modules/world/world.module';

@Module({
  imports: [
    RedisModule, 
    MongooseModule.forRoot('mongodb://localhost/diwos'),
    GameObjModule,
    UserModule,
    WorldModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
    Logger,
  ],
})

export class AppModule implements NestModule {
  constructor(@Inject(REDIS) private readonly redis: RedisClient) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          store: new (RedisStore(session))({ client: this.redis, logErrors: true }),
          saveUninitialized: false,
          secret: 'sup3rs3cr3t',
          resave: false,
          cookie: {
            sameSite: true,
            httpOnly: false,
            maxAge: 60000,
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
