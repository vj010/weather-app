import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { ErrorResponse } from './types/error-response.interface';

@Controller('/cities')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:cityId')
  async getCityById(
    @Param('cityId', ParseIntPipe) cityId: number,
  ): Promise<Record<string, any>[] | ErrorResponse> {
    return this.appService.getCityById(cityId);
  }
}
