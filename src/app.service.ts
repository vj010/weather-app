import { Injectable, OnModuleInit } from '@nestjs/common';
import { readFileSync } from 'fs';
import { InjectMysql, Mysql } from 'mysql2-nestjs';
import { CityTableQry } from './config/mysql-startup.queries';
import {
  cityJsonFilePath,
  initializeAppDBSchema,
  mySqlConfig,
} from './config/mysql.config';
import { UtilsService } from './utils/utils.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectMysql()
    private readonly mysql: Mysql,
    private utilsService: UtilsService,
  ) {}
  getHello(): string {
    return 'Hello !';
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
