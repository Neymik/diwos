import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { constants } from '../config/constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { SocketStrategy } from './strategies/socket.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ 
      session: true 
    }),
    JwtModule.register({
      secret: constants.jwtSecret,
      // signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, SocketStrategy],
  exports: [AuthService],
})
export class AuthModule {}
