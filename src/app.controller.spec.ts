import { HttpException, HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { CityMaster } from '../src/entities/city-master.entity';
import { ResponseErrors } from './types/errors.enum';
import { WeatherInfo } from './types/weather-data.interface';
describe('AppController tests', () => {
  let app: INestApplication;

  const dummyWeatherInfo: WeatherInfo = {
    type: 'Fog',
    type_description: 'fog',
    sunrise: new Date().toISOString(),
    sunset: new Date().toISOString(),
    temp: 12,
    temp_min: 14,
    temp_max: 20,
    pressure: 21,
    humidity: 45,
    clouds_percent: 62,
    wind_speed: 23,
  };

  let appService = {
    getCityById: (id: number) => {
      if (!id) {
        throw new HttpException(
          {
            code: ResponseErrors.NOT_FOUND,
            message: 'not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      const city = new CityMaster();
      city.id = id;
      return city;
    },

    getWeatherByCityId: (cityId: number) => {
      return dummyWeatherInfo;
    },
  };

  beforeAll(async () => {
    let module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppService)
      .useValue(appService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('getCityById success', async () => {
    await request(app.getHttpServer()).get('/cities/1').expect(HttpStatus.OK);
  });

  it('getCityById fail', async () => {
    await request(app.getHttpServer())
      .get('/cities/0')
      .expect(HttpStatus.NOT_FOUND)
      .expect({ code: ResponseErrors.NOT_FOUND, message: 'not found' });
  });

  it('getWeatherByCityId', async () => {
    await request(app.getHttpServer())
      .get('/cities/1/weather')
      .expect(HttpStatus.OK)
      .expect(dummyWeatherInfo);
  });
});
