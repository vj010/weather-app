import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AppService } from './app.service';
import { CityMaster } from './entities/city-master.entity';
import { CityInfo } from './types/city-info-interface';
import { ResponseErrors } from './types/errors.enum';
import { UtilsService } from './utils/utils.service';
describe('AppService tests', () => {
  let appService: AppService;

  beforeEach(async () => {
    let module = await Test.createTestingModule({
      imports: [ConfigModule],
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
});
