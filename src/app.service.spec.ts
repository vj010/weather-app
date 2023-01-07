import { HttpException, HttpModule, HttpStatus } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AppService } from './app.service';
import { CityMaster } from './entities/city-master.entity';
import { CityInfo } from './types/city-info-interface';
import { ResponseErrors } from './types/errors.enum';
import { UtilsService } from './utils/utils.service';
describe('AppService tests', () => {
  let appService: AppService;
  let utilsService: UtilsService;

  beforeEach(async () => {
    let module = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      providers: [
        AppService,
        UtilsService,
        {
          provide: 'CityMasterRepo',
          useFactory: () => {
            return {
              getCityById: (id: number) => {
                if (!id) {
                  return null;
                }
                const cityMaster = new CityMaster();
                cityMaster.id = id;
                cityMaster.name = 'test';
                cityMaster.latutitude = 23.7;
                cityMaster.longitude = 25.5;
                return cityMaster;
              },
            };
          },
        },
      ],
      exports: [AppService],
    }).compile();

    appService = module.get<AppService>(AppService);
    utilsService = module.get<UtilsService>(UtilsService);
  });

  it('AppService defined', () => {
    expect(appService).toBeDefined();
  });

  it('getCityById city Found', async () => {
    const cityInfo: CityInfo = await appService.getCityById(2);
    expect(cityInfo).toBeDefined();
    expect(cityInfo).toMatchObject({
      name: 'test',
      id: 2,
      lat: 23.7,
      lng: 25.5,
    });
  });

  it('getCityById city not found', async () => {
    try {
      await appService.getCityById(0);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error).toMatchObject(
        new HttpException(
          { code: ResponseErrors.NOT_FOUND, message: 'not found' },
          HttpStatus.NOT_FOUND,
        ),
      );
    }
  });

  it('getWeatherByCityId ', async () => {
    const weatherResponseObject = {
      data: {
        coord: {
          lon: 77.1025,
          lat: 28.7041,
        },
        weather: [
          {
            id: 741,
            main: 'Fog',
            description: 'fog',
            icon: '50d',
          },
        ],
        base: 'stations',
        main: {
          temp: 279.21,
          feels_like: 277.69,
          temp_min: 279.21,
          temp_max: 279.21,
          pressure: 1024,
          humidity: 93,
        },
        visibility: 50,
        wind: {
          speed: 2.06,
          deg: 300,
        },
        clouds: {
          all: 100,
        },
        dt: 1673066627,
        sys: {
          type: 1,
          id: 9165,
          country: 'IN',
          sunrise: 1673055928,
          sunset: 1673093359,
        },
        timezone: 19800,
        id: 7290413,
        name: 'Pitampura',
        cod: 200,
      },
    };
    const getWeatherDataSpy = jest.spyOn(utilsService, 'getWeatherData');
    getWeatherDataSpy.mockImplementation(async (city: CityInfo) => {
      return weatherResponseObject;
    });
    const weatherResponse = await appService.getWeatherByCityId(2);
    // console.log('weatherResponse', weatherResponse);
    expect(weatherResponse).toMatchObject({
      type: weatherResponseObject?.data?.weather[0]?.main,
      type_description: weatherResponseObject?.data?.weather[0]?.description,
      sunrise: new Date(
        weatherResponseObject?.data?.sys?.sunrise * 1000,
      ).toISOString(),
      sunset: new Date(
        weatherResponseObject?.data?.sys?.sunset * 1000,
      ).toISOString(),
      temp: weatherResponseObject?.data?.main.temp,
      temp_min: weatherResponseObject?.data?.main.temp_min,
      temp_max: weatherResponseObject?.data?.main.temp_max,
      pressure: weatherResponseObject?.data?.main.pressure,
      humidity: weatherResponseObject?.data?.main.humidity,
      clouds_percent: weatherResponseObject?.data?.clouds?.all,
      wind_speed: weatherResponseObject?.data?.wind?.speed,
    });
  });
});
