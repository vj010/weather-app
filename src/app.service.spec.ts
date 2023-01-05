import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AppService } from './app.service';
import { CityMaster } from './entities/city-master.entity';
import { RepositoryModule } from './repository/repository.module';
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
            return { getCityById: (id: number) => new CityMaster() };
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

  it('getCityById cityFound', async () => {
    expect(await appService.getCityById(2)).toBeInstanceOf(CityMaster);
  });
});
