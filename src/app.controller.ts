import {
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/cities')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:cityId')
  async getCityById(
    @Param('cityId', ParseIntPipe) cityId: number,
  ): Promise<Record<string, any> | HttpException> {
    return this.appService.getCityById(cityId);
  }

  // @Get('/cityId')
  // async getCitiesByLatLng(
  //   @Query('lat') lat: number,
  //   @Query('lng') lng: number,
  // ): Promise<Record<string, any>[] | ErrorResponse> {
  //   return this.appService.getCitiesByLatLng(lat,lng);
  // }
}
