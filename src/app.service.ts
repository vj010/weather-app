import {
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { readFileSync } from 'fs';
import { InjectMysql, Mysql } from 'mysql2-nestjs';
import { CityTableQry } from './config/mysql-startup.queries';
import {
  cityJsonFilePath,
  initializeAppDBSchema,
  mySqlConfig,
} from './config/mysql.config';
import { weatherApiKey, weatherApiUrl } from './config/weather-api.config';
import { CityInfo } from './types/city-info-interface';
import { ResponseErrors } from './types/errors.enum';
import { WeatherInfo } from './types/weather-data.interface';
import { UtilsService } from './utils/utils.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectMysql()
    private readonly mysql: Mysql,
    private utilsService: UtilsService,
    private httpService: HttpService,
  ) {}

  async getCityById(cityId: number): Promise<CityInfo> {
    const [records, _] = await this.utilsService.exectureQuery(
      this.mysql,
      mySqlConfig.database,
      'SELECT ID, NAME, LATITUDE,LONGITUDE FROM CITY_MASTER WHERE ID=?',
      [cityId],
    );
    if (records?.length) {
      return {
        id: records[0].ID,
        name: records[0].NAME,
        lat: records[0].LATITUDE,
        lng: records[0].LONGITUDE,
      };
    }

    throw new HttpException(
      { code: ResponseErrors.NOT_FOUND, message: 'not found' },
      HttpStatus.NOT_FOUND,
    );
  }

  async getWeatherByCityId(cityId: number): Promise<WeatherInfo> {
    const city: CityInfo = await this.getCityById(cityId);
    const requestUrl = `${weatherApiUrl}?lat=${city.lat}&lon=${city.lng}&appid=${weatherApiKey}`;
    console.log('requestUrl', requestUrl);
    const weatherData = await this.httpService.get(requestUrl).toPromise();

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
      clouds_percent: weatherData?.data?.cloud?.all,
      wind_speed: weatherData?.data?.wind?.speed,
    };
  }

  async getCityListByCordinates(lat: number, lng: number): Promise<CityInfo[]> {
    const query = `select ID, NAME, LATITUDE,LONGITUDE
    from CITY_MASTER 
    where LATITUDE!='' and LONGITUDE!='' 
    and ( 6371 * acos( cos( radians(${lat}) ) * cos( radians( LATITUDE ) ) * cos( radians( LONGITUDE ) - radians(${lng}) ) + sin( radians(${lat}) ) * sin( radians( LATITUDE ) ) ) ) <= 10;`;
    const [records, _] = await this.utilsService.exectureQuery(
      this.mysql,
      mySqlConfig.database,
      query,
    );

    return (
      records?.map((element) => {
        return {
          id: element.ID,
          name: element.NAME,
          lat: element.LATITUDE,
          lng: element.LONGITUDE,
        };
      }) ?? []
    );
  }

  async onModuleInit() {
    console.log('weather app started');

    if (!initializeAppDBSchema) {
      return;
    }

    const cityTableCreateResponse = await this.utilsService.exectureQuery(
      this.mysql,
      mySqlConfig.database,
      CityTableQry,
    );

    console.log('populating master table...please wait');
    const cityData = JSON.parse(readFileSync(cityJsonFilePath, 'utf-8'));
    const cityTablePopulateResponse = await this.utilsService.populateCityTable(
      this.mysql,
      mySqlConfig.database,
      cityData,
    );
  }
}
