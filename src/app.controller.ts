import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

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
