import { Controller, Get, Post, Res, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { PostLogin } from 'src/models/login.model'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  login(@Res() res: Response, @Body() req : PostLogin): string {
    res.send(this.appService.login(req))
    return
  }
}
