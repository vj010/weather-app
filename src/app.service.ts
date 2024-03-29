import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CityMasterRepositoryInterface } from './repositories/city-master-repo.interface';
import { CityInfo } from './types/city-info-interface';
import { ResponseErrors } from './types/errors.enum';
import { WeatherInfo } from './types/weather-data.interface';
import { UtilsService } from './utils/utils.service';

@Injectable()
export class AppService {
  constructor(
    @Inject('CityMasterRepo')
    private cityMasterRepository: CityMasterRepositoryInterface,
    private utilsService: UtilsService,
  ) {}

  async getCityById(cityId: number): Promise<CityInfo> {
    const city = await this.cityMasterRepository.getCityById(cityId);
    if (!city) {
      throw new HttpException(
        { code: ResponseErrors.NOT_FOUND, message: 'not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.utilsService.getCityInfoObject(city);
  }

  async getWeatherByCityId(cityId: number): Promise<WeatherInfo> {
    const city: CityInfo = await this.getCityById(cityId);
    const weatherData = await this.utilsService.getWeatherData(city);

    return {
      type: weatherData?.data?.weather[0]?.main,
      type_description: weatherData?.data?.weather[0]?.description,
      sunrise: new Date(weatherData?.data?.sys?.sunrise * 1000).toISOString(),
      sunset: new Date(weatherData?.data?.sys?.sunset * 1000).toISOString(),
      temp: weatherData?.data?.main.temp,
      temp_min: weatherData?.data?.main.temp_min,
      temp_max: weatherData?.data?.main.temp_max,
      pressure: weatherData?.data?.main.pressure,
      humidity: weatherData?.data?.main.humidity,
      clouds_percent: weatherData?.data?.clouds?.all,
      wind_speed: weatherData?.data?.wind?.speed,
    };
  }

  // async getCityListByCordinates(lat: number, lng: number): Promise<CityInfo[]> {
  //   const query = `select ID, NAME, LATITUDE,LONGITUDE
  //   FROM CITY_MASTER
  //   WHERE ( 6371 * ACOS( COS( RADIANS(${lat}) ) * COS( RADIANS( LATITUDE ) ) * COS( RADIANS( LONGITUDE ) - RADIANS(${lng}) ) + SIN( RADIANS(${lat}) ) * SIN( RADIANS( LATITUDE ) ) ) ) <= 10;`;
  //   const [records, _] = await this.utilsService.exectureQuery(
  //     this.mysql,
  //     mySqlConfig.database,
  //     query,
  //   );

  //   return (
  //     records?.map((element) => {
  //       return {
  //         id: element.ID,
  //         name: element.NAME,
  //         lat: element.LATITUDE,
  //         lng: element.LONGITUDE,
  //       };
  //     }) ?? []
  //   );
  // }

  // async onModuleInit() {
  //   console.log('weather app started');

  //   if (!initializeAppDBSchema) {
  //     return;
  //   }

  //   this.mysql.query(`CREATE DATABASE IF NOT EXISTS ${mySqlConfig.database}`);

  //   await this.utilsService.exectureQuery(
  //     this.mysql,
  //     mySqlConfig.database,
  //     CityTableQry,
  //   );

  //   console.log('populating master table...please wait');
  //   const cityData = JSON.parse(readFileSync(cityJsonFilePath, 'utf-8'));
  //   await this.utilsService.populateCityTable(
  //     this.mysql,
  //     mySqlConfig.database,
  //     cityData,
  //   );
  // }
}
