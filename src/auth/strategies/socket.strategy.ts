import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { constants } from '../../config/constants';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SocketStrategy extends PassportStrategy(Strategy, 'socket') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: (request) => {
        return request?.handshake?.headers?.authorization
      },
      ignoreExpiration: false,
      secretOrKey: constants.jwtSecret,
    });
  }

  async validate(payload: any) {
    // console.log(payload)
    const user = await this.userService.findOne(payload.username);
    return user; //{ username: payload.username };
  }
}
