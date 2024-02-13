import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Main Controller')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOkResponse()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
