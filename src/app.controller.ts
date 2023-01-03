import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ParseNumber } from './pipes/parse-number.pipe';
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

  // @Get('/:cityId/weather')
  // async getWeatherByCityId(@Param('cityId', ParseIntPipe) cityId: number) {
  //   return this.appService.getWeatherByCityId(cityId);
  // }

  // @Get('/')
  // async getCityListByCordinates(
  //   @Query('lat', ParseNumber) lat: number,
  //   @Query('lng', ParseNumber) lng: number,
  // ): Promise<CityInfo[]> {
  //   return this.appService.getCityListByCordinates(lat, lng);
  // }
}
