import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
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
import { ErrorResponse } from './types/error-response.interface';
import { ResponseErrors } from './types/errors.enum';
import { UtilsService } from './utils/utils.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectMysql()
    private readonly mysql: Mysql,
    private utilsService: UtilsService,
  ) {}

  async getCityById(
    cityId: number,
  ): Promise<Record<string, any> | HttpException> {
    const [records, _] = await this.utilsService.exectureQuery(
      this.mysql,
      mySqlConfig.database,
      'SELECT ID, NAME FROM CITY_MASTER WHERE ID=?',
      [cityId],
    );
    if (records?.length) {
      return records[0];
    }

    throw new HttpException(
      { code: ResponseErrors.NOT_FOUND, message: 'not found' },
      HttpStatus.NOT_FOUND,
    );
  }

  // async getCitiesByLatLng(
  //   lat: number,
  //   lng: number,
  // ): Promise<Record<string, any>[] | ErrorResponse> {}

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
