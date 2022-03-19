import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CityInfo } from './types/city-info-interface';

@Controller('/cities')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:cityId')
  async getCityById(
    @Param('cityId', ParseIntPipe) cityId: number,
  ): Promise<CityInfo> {
    return this.appService.getCityById(cityId);
  }

  @Get('/:cityId/weather')
  async getWeatherByCityId(@Param('cityId', ParseIntPipe) cityId: number) {
    return this.appService.getWeatherByCityId(cityId);
  }
}
