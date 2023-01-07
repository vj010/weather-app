import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CityMaster } from 'src/entities/city-master.entity';
import { CityInfo } from 'src/types/city-info-interface';

@Injectable()
export class UtilsService {
  private readonly weatherApiUrl =
    this.configService.get<string>('WEATHER_API_URL');
  private readonly weatherApiKey =
    this.configService.get<string>('WEATHER_API_KEY');
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  getCityInfoObject(cityMaster: CityMaster): CityInfo {
    return {
      name: cityMaster.name,
      id: cityMaster.id,
      lat: cityMaster.latutitude,
      lng: cityMaster.longitude,
    };
  }

  async getWeatherData(city: CityInfo): Promise<any> {
    const requestUrl = `${this.weatherApiUrl}?lat=${city.lat}&lon=${city.lng}&appid=${this.weatherApiKey}`;
    const weatherData = await this.httpService.get(requestUrl).toPromise();
    return weatherData;
  }
}
