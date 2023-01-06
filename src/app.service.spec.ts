import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AppService } from './app.service';
import { CityMaster } from './entities/city-master.entity';
import { ResponseErrors } from './types/errors.enum';
describe('AppService tests', () => {
  let appService: AppService;

  beforeEach(async () => {
    let module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        AppService,
        {
          provide: 'CityMasterRepo',
          useFactory: () => {
            return {
              getCityById: (id: number) => {
                if (!id) {
                  return null;
                }
                return new CityMaster();
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
    expect(await appService.getCityById(2)).toBeInstanceOf(CityMaster);
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
