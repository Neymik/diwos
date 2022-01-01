import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService {
  makeToken(): any{
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < 200; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
  getHello(): string {
    return 'Hello World';
  }
  login(req): any {
    var user_login = req.login
    var user_password = req.password

    const token = user_login + String(this.makeToken())

    return req;
  }
}

