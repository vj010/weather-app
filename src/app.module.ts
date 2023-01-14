import { HttpModule, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilsModule } from './utils/utils.module';
import { RepositoryModule } from './repository/repository.module';
import { readFileSync } from 'fs';
import { cityJsonFilePath } from './config/mysql.config';
import { clearLine, cursorTo } from 'readline';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        username: configService.get<string>('MYSQL_USER'),
        password: configService.get<string>('MYSQL_PASS'),
        database: configService.get<string>('MYSQL_DB'),
        port: configService.get<number>('MYSQL_PORT'),
        entities: ['dist/**/*.entity{.ts,.js}'],
      }),
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    UtilsModule,
    HttpModule,
    RepositoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    private dataSource: DataSource,
  ) {}
  private readonly initializeAppDBSpchema =
    this.configService.get<boolean>('INITIALIZE_DB');
  private readonly mysqlDb = this.configService.get<string>('MYSQL_DB');
  private readonly cityJsonFilePath = this.configService.get<string>(
    'CONTAINER_CITY_JSON_FILE_PATH',
  );

  async onModuleInit() {
    console.log('weather app started');

    if (!this.initializeAppDBSpchema) {
      return;
    }

    console.log('populating master table...please wait');
    const cityData = JSON.parse(readFileSync(cityJsonFilePath, 'utf-8'));
    await this.populateCityTable(cityData);
  }

  async populateCityTable(cityData: Record<string, any>[]) {
    const insertquery = `INSERT IGNORE INTO CITY_MASTER(NAME, STATE,COUNTRY,LONGITUDE,LATITUDE) values`;
    try {
      let insertBatch = ``;
      let comma = '';
      let batchSize = 0;
      for (let i = 0; i < cityData.length; i++) {
        insertBatch += `${comma} ("${cityData[i].name.replace(
          /[\\$'"]/g,
          '\\$&',
        )}", "${cityData[i].state.replace(/[\\$'"]/g, '\\$&')}", "${cityData[
          i
        ].country.replace(/[\\$'"]/g, '\\$&')}", ${cityData[i].coord.lon},${
          cityData[i].coord.lat
        })`;
        comma = ',';
        batchSize++;
        if (batchSize >= 50) {
          await this.dataSource.manager.query(insertquery + insertBatch);
          batchSize = 0;
          insertBatch = ``;
          comma = '';
          process.stdout.write(`processed ${i} of ${cityData.length} records`);
          clearLine(process.stdout, 0);
          cursorTo(process.stdout, 0, null);
        }
      }
      if (batchSize > 0) {
        await this.dataSource.manager.query(insertquery + insertBatch);
        process.stdout.write(
          `processed ${cityData.length} of ${cityData.length} records\n`,
        );
        clearLine(process.stdout, 0);
        cursorTo(process.stdout, 0, null);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
