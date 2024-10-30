import { Controller, Get, Param, Req, Response } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('img/:folder/:filename')
  getFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Response() res,
  ) {
    return this.appService.getFile(folder, filename, res);
  }
}
