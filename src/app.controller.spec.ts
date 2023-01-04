import { HttpException, HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { CityMaster } from './entities/city-master.entity';
import { ResponseErrors } from './types/errors.enum';
describe('AppController tests', () => {
  let app: INestApplication;
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
});
